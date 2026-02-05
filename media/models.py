from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.search import index
from wagtail.snippets.models import register_snippet


@register_snippet
class Topic(models.Model):
    name = models.CharField(max_length=100)

    panels = [
        FieldPanel("name"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]


class MediaHubPage(Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
    ]

    max_count = 1
    subpage_types = ['media.MessagePage']
    parent_page_types = ['home.HomePage']


class MessagePage(Page):
    date = models.DateField("Post date")
    youtube_url = models.URLField(help_text="YouTube video URL")
    transcription = RichTextField(blank=True)
    category = models.CharField(
        max_length=20,
        choices=[('Sunday Message', 'Sunday Message'), ('Prophecy', 'Prophecy')],
        default='Sunday Message'
    )
    topics = models.ManyToManyField(Topic, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('date'),
        FieldPanel('category'),
        FieldPanel('youtube_url'),
        FieldPanel('topics'),
        FieldPanel('transcription'),
    ]

    search_fields = Page.search_fields + [
        index.SearchField('transcription'),
        index.FilterField('category'),
        index.FilterField('date'),
    ]

    parent_page_types = ['media.MediaHubPage']

    class Meta:
        ordering = ["-date"]
