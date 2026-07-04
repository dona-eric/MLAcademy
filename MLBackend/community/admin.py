from django.contrib import admin
from .models import (
    Company, JobOffer, JobApplication, Category, Channel, ChannelMessage,
    SponsoredChallenge, ChallengeSubmission, MentorshipRelation,
    DirectConversation, DirectMessage
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')

@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'icon', 'order', 'is_private')
    list_filter = ('category', 'is_private')

@admin.register(ChannelMessage)
class ChannelMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'channel', 'created_at')
    list_filter = ('channel', 'user')
    search_fields = ('content',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', "position_geographique" ,'is_verified')
    search_fields = ('name',)

@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'contract_type', 'is_active', 'posted_at')
    list_filter = ('contract_type', 'is_active', 'company')
    search_fields = ('title', 'description')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'status', 'applied_at')
    list_filter = ('status', 'job')


# --- Nouveaux modèles ---

@admin.register(SponsoredChallenge)
class SponsoredChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'difficulty', 'is_active', 'is_approved', 'deadline', 'prize_pool')
    list_filter = ('difficulty', 'is_active', 'is_approved', 'company')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    actions = ['approve_challenges']

    @admin.action(description="Approuver les challenges sélectionnés")
    def approve_challenges(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} challenge(s) approuvé(s).")


@admin.register(ChallengeSubmission)
class ChallengeSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'status', 'score', 'rank', 'submitted_at')
    list_filter = ('status', 'challenge')
    search_fields = ('user__email', 'challenge__title')


@admin.register(MentorshipRelation)
class MentorshipRelationAdmin(admin.ModelAdmin):
    list_display = ('mentor', 'student', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(DirectConversation)
class DirectConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_offer', 'created_at', 'updated_at')
    list_filter = ('created_at',)


@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('content', 'sender__email')
