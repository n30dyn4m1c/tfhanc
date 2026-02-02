from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel

class GivingPage(Page):
    intro = RichTextField(blank=True)
    giving_text = RichTextField(blank=True, help_text="Information about Tithes and Offerings")
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('giving_text'),
    ]
