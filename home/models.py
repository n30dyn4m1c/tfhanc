from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.fields import RichTextField

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
