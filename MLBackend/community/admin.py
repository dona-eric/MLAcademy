from django.contrib import admin
from .models import Company, JobOffer, JobApplication, Category, Channel, ChannelMessage

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
    list_display = ('name', 'location', 'is_verified')
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
