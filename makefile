.PHONY: help build up down logs clean restart

help:
	@echo "Available commands:"
	@echo "  make build    - Build all Docker images"
	@echo "  make up       - Start all containers"
	@echo "  make down     - Stop all containers"
	@echo "  make logs     - View logs"
	@echo "  make clean    - Remove all containers and volumes"
	@echo "  make restart  - Restart all containers"

build:
	docker-compose -f docker-compose.prod.yml build

up:
	docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

down:
	docker-compose -f docker-compose.prod.yml down

logs:
	docker-compose -f docker-compose.prod.yml logs -f

clean:
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -af

restart:
	docker-compose -f docker-compose.prod.yml restart
