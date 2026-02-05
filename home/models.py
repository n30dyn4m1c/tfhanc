from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.search import index
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting


@register_setting
class SiteSettings(BaseSiteSetting):
    church_name = models.CharField(max_length=255, default="The Father's House, All Nations Church")
    tagline = models.CharField(max_length=255, default="Executing the Mandate. Advancing the Kingdom. It is NOW!", blank=True)
    service_times = models.CharField(max_length=255, default="Sunday 9:00 AM – 1:30 PM", blank=True)
    location_line_1 = models.CharField(max_length=255, default="Gordon International School Hall,", blank=True)
    location_line_2 = models.CharField(max_length=255, default="Port Moresby", blank=True)
    google_maps_url = models.URLField(default="https://maps.google.com", blank=True)
    facebook_url = models.URLField(default="https://facebook.com/tfhanc", blank=True)
    copyright_text = models.CharField(
        max_length=255,
        default="2026 The Father's House, All Nations Church. All Rights Reserved.",
        blank=True,
    )

    panels = [
        MultiFieldPanel([
            FieldPanel("church_name"),
            FieldPanel("tagline"),
        ], heading="Identity"),
        MultiFieldPanel([
            FieldPanel("service_times"),
            FieldPanel("location_line_1"),
            FieldPanel("location_line_2"),
            FieldPanel("google_maps_url"),
        ], heading="Location & Times"),
        MultiFieldPanel([
            FieldPanel("facebook_url"),
        ], heading="Social Media"),
        FieldPanel("copyright_text"),
    ]

    class Meta:
        verbose_name = "Site Settings"


class HomePage(Page):
    # Hero Section
    hero_title = models.CharField(max_length=255, blank=True, help_text="High-impact hero title")
    hero_subtitle = models.CharField(max_length=255, blank=True, help_text="Executing the Mandate. Advancing the Kingdom. It is NOW!")
    hero_cta_text = models.CharField(max_length=50, default="Join Us for Service", blank=True)
    hero_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    # Countdown
    countdown_target = models.DateTimeField(null=True, blank=True, help_text="Next service time for the countdown timer")

    # First Time Guests Section
    guest_header = models.CharField(max_length=255, default="First Time Guests", blank=True)
    salvation_prayer_title = models.CharField(max_length=255, default="The Salvation Prayer", blank=True)
    salvation_prayer_text = RichTextField(blank=True)

    # Connect Section
    connect_title = models.CharField(max_length=255, default="Connect with Us", blank=True)
    connect_text = models.TextField(blank=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('hero_title'),
            FieldPanel('hero_subtitle'),
            FieldPanel('hero_cta_text'),
            FieldPanel('hero_image'),
        ], heading="Hero Section"),
        FieldPanel('countdown_target'),
        MultiFieldPanel([
            FieldPanel('guest_header'),
            FieldPanel('salvation_prayer_title'),
            FieldPanel('salvation_prayer_text'),
        ], heading="First Time Guests"),
        MultiFieldPanel([
            FieldPanel('connect_title'),
            FieldPanel('connect_text'),
        ], heading="Connect Section"),
    ]

    search_fields = Page.search_fields + [
        index.SearchField('hero_title'),
        index.SearchField('hero_subtitle'),
        index.SearchField('salvation_prayer_text'),
        index.SearchField('connect_text'),
    ]

    max_count = 1
    subpage_types = [
        'media.MediaHubPage',
        'giving.GivingPage',
        'contact.ConnectionCardPage',
    ]
    parent_page_types = ['wagtailcore.Page']
