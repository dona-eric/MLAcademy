from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JobOfferViewSet, TalentHubViewSet, MyApplicationsViewSet, 
    LeaderboardViewSet, MatchingViewSet, ChannelViewSet, CategoryViewSet,
    RecruitmentDashboardViewSet, ChallengeViewSet, MentorshipViewSet,
    DirectMessageViewSet, community_stats
)

router = DefaultRouter()
router.register(r'jobs', JobOfferViewSet, basename='job-offer')
router.register(r'talents', TalentHubViewSet, basename='talent-hub')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'matching', MatchingViewSet, basename='matching')
router.register(r'channels', ChannelViewSet, basename='channel')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'my-applications', MyApplicationsViewSet, basename='my-application')
router.register(r'recruitment', RecruitmentDashboardViewSet, basename='recruitment')
# Nouveaux endpoints
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'mentorship', MentorshipViewSet, basename='mentorship')
router.register(r'dm', DirectMessageViewSet, basename='direct-message')

urlpatterns = [
    path('stats/', community_stats, name='community-stats'),
    path('', include(router.urls)),
]
