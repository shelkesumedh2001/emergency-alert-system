from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta
import pytz
from flask_cors import CORS
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///emergency.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'faculty' or 'security'
    
    created_alerts = db.relationship(
        'Alert',
        backref='creator',
        foreign_keys='Alert.user_id',
        lazy=True
    )
    
    acknowledged_alerts = db.relationship(
        'Alert',
        backref='acknowledger',
        foreign_keys='Alert.acknowledged_by',
        lazy=True
    )

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    status = db.Column(db.String(20), nullable=False, default='active')
    acknowledged = db.Column(db.Boolean, default=False)
    acknowledged_at = db.Column(db.DateTime, nullable=True)
    acknowledged_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

def format_timestamp(dt):
    if dt is None:
        return None
    ist = pytz.timezone('Asia/Kolkata')
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(ist).isoformat()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.session.get(User, data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Invalid token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        email=data['email'],
        password=hashed_password,
        name=data['name'],
        role=data['role']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(days=1)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token})
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/alert', methods=['POST'])
@token_required
def create_alert(current_user):
    if current_user.role != 'faculty':
        return jsonify({'message': 'Unauthorized'}), 403
        
    data = request.get_json()
    new_alert = Alert(
        user_id=current_user.id,
        latitude=data['latitude'],
        longitude=data['longitude']
    )
    
    db.session.add(new_alert)
    db.session.commit()
    
    return jsonify({'message': 'Alert created successfully'}), 201

@app.route('/alerts', methods=['GET'])
@token_required
def get_alerts(current_user):
    if current_user.role != 'security':
        return jsonify({'message': 'Unauthorized'}), 403
        
    try:
        # Get all alerts and include status
        alerts = Alert.query.order_by(Alert.timestamp.desc()).all()
        
        return jsonify([{
            'id': alert.id,
            'user': alert.creator.name,
            'latitude': alert.latitude,
            'longitude': alert.longitude,
            'timestamp': format_timestamp(alert.timestamp),
            'acknowledged': alert.acknowledged,
            'acknowledgementTime': format_timestamp(alert.acknowledged_at) if alert.acknowledged_at else None,
            'status': alert.status,
            'acknowledgedBy': alert.acknowledger.name if alert.acknowledger else None
        } for alert in alerts])
    except Exception as e:
        print(f"Error fetching alerts: {e}")
        return jsonify({'message': 'Failed to fetch alerts'}), 500

@app.route('/alert/<int:alert_id>/acknowledge', methods=['POST'])
@token_required
def acknowledge_alert(current_user, alert_id):
    if current_user.role != 'security':
        return jsonify({'message': 'Unauthorized'}), 403
        
    alert = Alert.query.get_or_404(alert_id)
    
    # Remove the check for existing acknowledgment to allow re-acknowledgment
    alert.acknowledged = True
    ist_now = datetime.now(pytz.timezone('Asia/Kolkata'))
    alert.acknowledged_at = ist_now
    alert.acknowledged_by = current_user.id
    alert.status = 'resolved'
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Alert acknowledged successfully',
            'acknowledged_at': format_timestamp(alert.acknowledged_at),
            'acknowledged_by': current_user.name,
            'alert': {
                'id': alert.id,
                'user': alert.creator.name,
                'latitude': alert.latitude,
                'longitude': alert.longitude,
                'timestamp': format_timestamp(alert.timestamp),
                'acknowledged': alert.acknowledged,
                'acknowledgementTime': format_timestamp(alert.acknowledged_at)
            }
        })
    except Exception as e:
        db.session.rollback()
        print(f"Error acknowledging alert: {e}")
        return jsonify({'message': 'Failed to acknowledge alert'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', debug=True)
