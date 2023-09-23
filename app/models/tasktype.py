from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

class TaskType(db.Model):
    __tablename__ = 'tasktypes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Text)
    image = db.Column(db.Text)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow)

    tasks = db.relationship('Task', back_populates='taskType')
    taskertasktypes = db.relationship('TaskerTaskType', back_populates='taskType')

    def __repr__(self):
        return f'id:{self.id}, type:{self.type}'

    def to_dict_full(self):
        return {
            'id': self.id,
            'type': self.type,
            'image': self.image,
            'createdAt': self.createdAt.isoformat(),
            'updatedAt': self.updatedAt.isoformat()
        }

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
        }
