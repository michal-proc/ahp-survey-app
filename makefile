up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose down && docker-compose up -d

build:
	docker-compose build

ps:
	docker-compose ps

clean:
	docker-compose down --volumes --remove-orphans

rebuild:
	docker-compose down --volumes --remove-orphans && docker-compose build && docker-compose up -d
