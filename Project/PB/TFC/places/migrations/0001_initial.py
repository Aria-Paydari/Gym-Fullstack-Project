# Generated by Django 4.1.3 on 2022-11-30 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default=None, max_length=200, unique=True)),
                ('description', models.CharField(blank=True, default=None, max_length=200)),
                ('keywords', models.CharField(blank=True, default=None, max_length=200)),
                ('capacity', models.PositiveIntegerField(blank=True, default=None)),
                ('coach', models.CharField(blank=True, default=None, max_length=200)),
                ('times', models.CharField(blank=True, default=None, max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Studio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default=None, max_length=200, unique=True)),
                ('address', models.CharField(blank=True, default=None, max_length=200, unique=True)),
                ('location', models.CharField(blank=True, default=None, max_length=200)),
                ('postal_code', models.CharField(blank=True, default=None, max_length=7)),
                ('phone_number', models.PositiveIntegerField(blank=True, default=None)),
                ('images', models.TextField(blank=True, default='')),
                ('amenities', models.TextField(blank=True, default='')),
                ('classes', models.ManyToManyField(blank=True, default=None, to='places.class')),
            ],
        ),
    ]
