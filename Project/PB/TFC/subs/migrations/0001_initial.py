# Generated by Django 4.1.3 on 2022-11-30 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField(blank=True, default=0)),
                ('plan', models.CharField(blank=True, default=None, max_length=200)),
            ],
        ),
    ]
