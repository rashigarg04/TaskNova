from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=100)
    date = models.CharField(max_length=50) # Using string to match existing frontend data format
    priority = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_urgent(self):
        from datetime import datetime, date
        try:
            task_date = datetime.strptime(self.date, '%Y-%m-%d').date()
            today = date.today()
            return (task_date - today).days <= 2
        except:
            return False

    def __str__(self):
        return self.title

class Notification(models.Model):
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[:50]
