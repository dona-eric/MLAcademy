from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, JobOfferViewSet, TalentHubViewSet, MyApplicationsViewSet, 
    LeaderboardViewSet, MatchingViewSet, ChannelViewSet, CategoryViewSet,
    RecruitmentDashboardViewSet, ChallengeViewSet, MentorshipViewSet,
    DirectMessageViewSet, BadgeViewSet, my_streak, community_stats, community_chat
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'jobs', JobOfferViewSet, basename='job-offer')
router.register(r'talents', TalentHubViewSet, basename='talent-hub')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'matching', MatchingViewSet, basename='matching')
router.register(r'channels', ChannelViewSet, basename='channel')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'my-applications', MyApplicationsViewSet, basename='my-application')
router.register(r'recruitment', RecruitmentDashboardViewSet, basename='recruitment')
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'mentorship', MentorshipViewSet, basename='mentorship')
router.register(r'dm', DirectMessageViewSet, basename='direct-message')
router.register(r'badges', BadgeViewSet, basename='badge')

urlpatterns = [
    path('stats/', community_stats, name='community-stats'),
    path('chat/', community_chat, name='community-chat'),
    path('my-streak/', my_streak, name='my-streak'),
    path('', include(router.urls)),
]
