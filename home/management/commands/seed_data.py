import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.utils import timezone
from datetime import timedelta
from wagtail.models import Page, Site
from wagtail.images.models import Image
from home.models import HomePage
from media.models import MediaHubPage, MessagePage, Topic
from contact.models import ConnectionCardPage, FormField
from giving.models import GivingPage

class Command(BaseCommand):
    help = 'Seeds the database with initial dummy content for TFHANC'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # 1. Setup Hero Image
        image_path = '/home/neo/.gemini/antigravity/brain/37b701b7-273c-497e-986e-78de96eb20f9/church_hero_image_purple_1769997743802.png'
        hero_image = Image.objects.filter(title="Church Hero Purple").first()
        if not hero_image and os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                hero_image = Image.objects.create(
                    title="Church Hero Purple",
                    file=File(f, name="hero.png")
                )
        elif not hero_image:
            self.stdout.write(self.style.WARNING(f'Hero image not found and file missing at {image_path}'))

        # 2. Setup HomePage
        try:
            home_page = HomePage.objects.get(id=3)
            home_page.title = "The Father's House, All Nations Church"
            home_page.hero_title = "Executing the Mandate."
            home_page.hero_subtitle = "Advancing the Kingdom. It is NOW!"
            home_page.hero_cta_text = "Join Us for Service"
            home_page.hero_image = hero_image
            
            now = timezone.now()
            days_ahead = (6 - now.weekday()) % 7
            if days_ahead == 0 and now.hour >= 9:
                days_ahead = 7
            next_sunday = now.replace(hour=9, minute=0, second=0, microsecond=0) + timedelta(days=days_ahead)
            home_page.countdown_target = next_sunday
            
            home_page.guest_header = "Welcome to Our Family"
            home_page.salvation_prayer_title = "The Prayer of Salvation"
            home_page.salvation_prayer_text = "<p>Heavenly Father, I come to You in the Name of Jesus. I believe that Jesus Christ is the Son of God, and that He died for my sins and was raised from the dead for my justification. I receive Him now as my Lord and Savior. Amen.</p>"
            home_page.connect_title = "Stay Connected"
            home_page.connect_text = "Whether you're a first-time guest or a long-time member, we want to hear from you."
            home_page.save_revision().publish()
            self.stdout.write(self.style.SUCCESS('HomePage updated.'))
        except HomePage.DoesNotExist:
            self.stdout.write(self.style.ERROR('Default HomePage not found. Check ID.'))
            return

        # 3. Create MediaHubPage
        media_hub = MediaHubPage.objects.filter(slug='media').first()
        if not media_hub:
            media_hub = MediaHubPage(
                title='Media Hub',
                slug='media',
                intro='<p>Catch up on latest messages and prophetic declarations.</p>',
            )
            home_page.add_child(instance=media_hub)
            media_hub.save_revision().publish()
            self.stdout.write(self.style.SUCCESS('MediaHubPage created.'))

        # Add dummy messages
        Topic.objects.get_or_create(name="Kingdom")
        Topic.objects.get_or_create(name="Prophecy")
        
        msg = MessagePage.objects.filter(slug='sunday-message-jan-2026').first()
        if not msg:
            msg = MessagePage(
                title='Sunday Message: The Power of Now',
                slug='sunday-message-jan-2026',
                date=timezone.now().date(),
                youtube_url='https://www.youtube.com/embed/dQw4w9WgXcQ',
                category='Sunday Message',
                transcription='<p>This is a dummy transcription for the message.</p>',
            )
            media_hub.add_child(instance=msg)
            msg.save_revision().publish()
            self.stdout.write(self.style.SUCCESS('MessagePage created.'))

        # 4. Create GivingPage
        giving = GivingPage.objects.filter(slug='giving').first()
        if not giving:
            giving = GivingPage(
                title='Giving',
                slug='giving',
                intro='<p>Partner with us in advancing the Kingdom.</p>',
                giving_text='<p>Your tithes and offerings support our mission to spread the Gospel across nations.</p>',
            )
            home_page.add_child(instance=giving)
            giving.save_revision().publish()
            self.stdout.write(self.style.SUCCESS('GivingPage created.'))

        # 5. Create ConnectionCardPage
        connection = ConnectionCardPage.objects.filter(slug='connect').first()
        if not connection:
            connection = ConnectionCardPage(
                title='Connect',
                slug='connect',
                intro='<p>Fill out the form below and our team will get in touch with you.</p>',
                thank_you_text='<p>Thank you for connecting with us! God bless you.</p>',
                to_address='info@tfhanc.org',
                from_address='website@tfhanc.org',
                subject='New Connection Card Submission',
            )
            home_page.add_child(instance=connection)
            # Add form fields
            FormField.objects.create(page=connection, label="Full Name", field_type='singleline', required=True)
            FormField.objects.create(page=connection, label="Email", field_type='email', required=True)
            FormField.objects.create(page=connection, label="Prayer Request", field_type='multiline', required=False)
            connection.save_revision().publish()
            self.stdout.write(self.style.SUCCESS('ConnectionCardPage created.'))

        # 6. Ensure Site is configured
        site = Site.objects.get(is_default_site=True)
        site.root_page = home_page
        site.site_name = "The Father's House, All Nations Church"
        site.save()

        self.stdout.write(self.style.SUCCESS('Seeding completed!'))
