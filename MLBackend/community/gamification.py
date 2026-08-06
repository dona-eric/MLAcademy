import math
import logging
from datetime import date, timedelta
from django.utils import timezone
from django.db import transaction
from community.models import Badge, UserBadge, UserStreak

logger = logging.getLogger(__name__)

# System Thresholds for Ranking Tiers
RANK_TIERS = [
    (50000, "Grand Master"),
    (30000, "Master"),
    (15000, "Diamond"),
    (8000, "Platinum"),
    (3500, "Gold"),
    (1000, "Silver"),
    (0, "Bronze"),
]

def calculate_level(xp):
    """Calcule le niveau basé sur l'équation mathématique Level = 1 + sqrt(XP / 100)"""
    if xp <= 0:
        return 1
    return int(math.floor(1 + math.sqrt(xp / 100)))

def calculate_rank(xp):
    """Retourne le rang (Tier) en fonction des points XP accumulés."""
    for min_xp, rank_name in RANK_TIERS:
        if xp >= min_xp:
            return rank_name
    return "Bronze"

def update_user_streak(user):
    """
    Gère la série de jours d'apprentissage consécutifs (Streak) et le Streak Freeze.
    """
    today = date.today()
    streak, created = UserStreak.objects.get_or_create(user=user)
    
    if streak.last_activity_date == today:
        # Déjà actif aujourd'hui
        return streak

    if streak.last_activity_date == today - timedelta(days=1):
        # Jour consécutif parfait
        streak.current_streak += 1
    elif streak.last_activity_date is not None and streak.last_activity_date < today - timedelta(days=1):
        # Absence d'un ou plusieurs jours : Vérifier si Streak Freeze disponible
        days_missed = (today - streak.last_activity_date).days
        if days_missed == 2 and streak.streak_freezes_available > 0:
            # Utilisation de la protection Streak Freeze
            streak.streak_freezes_available -= 1
            streak.current_streak += 1
            logger.info(f"Streak Freeze consommé pour {user.email} (Série préservée: {streak.current_streak}j)")
        else:
            # Recommence la série
            streak.current_streak = 1
    else:
        # Première activité
        streak.current_streak = 1

    if streak.current_streak > streak.max_streak:
        streak.max_streak = streak.current_streak

    streak.last_activity_date = today
    streak.save()
    return streak

def award_badge(user, badge):
    """
    Attribue un badge à l'utilisateur, augmente son XP et émet une alerte WebSocket temps réel.
    """
    user_badge, created = UserBadge.objects.get_or_create(user=user, badge=badge)
    if created:
        user.xp_points = getattr(user, 'xp_points', 0) + badge.xp_reward
        user.save(update_fields=['xp_points'])

        logger.info(f"🏆 Badge débloqué pour {user.email} : {badge.name} (+{badge.xp_reward} XP)")

        # Émission WebSocket temps réel via Django Channels
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    f"user_{user.id}",
                    {
                        "type": "badge_unlocked",
                        "badge": {
                            "id": badge.id,
                            "name": badge.name,
                            "description": badge.description,
                            "icon": badge.icon,
                            "category": badge.category,
                            "xp_reward": badge.xp_reward,
                        }
                    }
                )
        except Exception as e:
            logger.warning(f"Impossible d'émettre l'alerte WebSocket du badge : {e}")

        return user_badge, True
    return user_badge, False

def evaluate_user_gamification(user, event_type, extra_data=None):
    """
    Évalue la progression de l'utilisateur suite à un événement (leçon, quiz, challenge, connexion).
    """
    if not user or not user.is_authenticated:
        return []

    newly_unlocked = []

    # 1. Mise à jour du Streak
    streak = update_user_streak(user)

    # 2. Vérification des badges selon event_type
    eligible_badges = Badge.objects.filter(condition_type=event_type)

    for badge in eligible_badges:
        unlocked = False

        if event_type == 'first_login':
            unlocked = True
        elif event_type == 'streak_days':
            if streak.current_streak >= badge.condition_value:
                unlocked = True
        elif event_type == 'night_owl':
            # Badge secret : Action effectuée entre 1h et 4h du matin
            current_hour = timezone.now().hour
            if 1 <= current_hour <= 4:
                unlocked = True
        elif event_type == 'lesson_completed':
            # Décompte des leçons si disponible
            unlocked = True
        elif event_type in ['quiz_perfect', 'challenge_submitted', 'bug_hunter']:
            unlocked = True

        if unlocked:
            ub, is_new = award_badge(user, badge)
            if is_new:
                newly_unlocked.append(ub)

    return newly_unlocked
