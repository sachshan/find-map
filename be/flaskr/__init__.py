import os

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from .redis_be import Redis

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    @app.before_request
    def before_request():
        headers = {'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'}
        if request.method.lower() == 'options':
            return jsonify(headers), 200

    try:
        redis_host = os.getenv('REDIS_HOST', 'map-redis-svc')
        redis_port = os.getenv('REDIS_PORT', 6379)
        redis = Redis(redis_host, redis_port)
        # redis = Redis('redis_cache', 6379)
    except:
        app.logger.error("Unable to connect to Redis")

    @app.route('/healthz', methods=['GET'])
    def get_server_healthz():
        if redis.get_redis_client().ping():
            return {'message': 'This system works'}, 200
        return {'message': 'Server not working'}, 500
    

    @app.route('/healthb', methods=['GET'])
    def get_server_healthb():
        return {'message': 'This system works'}, 200

    from flaskr.map.routes import map

    app.register_blueprint(map)
    return app