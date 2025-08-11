#!/bin/bash

# BitTravel Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
}

setup_env() {
    print_status "Setting up environment files..."
    
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from example"
        print_warning "Please update backend/.env with your configuration, especially JWT_SECRET"
    fi
    
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        print_success "Created frontend/.env from example"
    fi
}

build_and_start() {
    local mode=${1:-prod}
    
    print_status "Building and starting services in $mode mode..."
    
    if [ "$mode" == "dev" ]; then
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
    else
        docker-compose up --build
    fi
}

start_services() {
    local mode=${1:-prod}
    
    print_status "Starting services in $mode mode..."
    
    if [ "$mode" == "dev" ]; then
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    else
        docker-compose up -d
    fi
    
    print_success "Services started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5000"
    print_status "Health Check: http://localhost:5000/health"
}

stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped successfully!"
}

restart_services() {
    print_status "Restarting services..."
    docker-compose restart
    print_success "Services restarted successfully!"
}

view_logs() {
    local service=${1:-""}
    
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

cleanup() {
    print_warning "This will remove all containers, networks, and images. Data volumes will be preserved."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down --rmi all
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

reset_database() {
    print_warning "This will DELETE ALL DATABASE DATA!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down
        docker volume rm bittravel_postgres_data 2>/dev/null || true
        print_success "Database reset completed!"
        print_status "Run 'start' command to recreate the database"
    else
        print_status "Database reset cancelled."
    fi
}

show_status() {
    print_status "Service Status:"
    docker-compose ps
}

show_help() {
    echo "BitTravel Docker Management Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  setup          Set up environment files"
    echo "  build          Build and start services (production mode)"
    echo "  build-dev      Build and start services (development mode)"
    echo "  start          Start services (production mode)"
    echo "  start-dev      Start services (development mode)"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  logs [service] View logs for all services or specific service"
    echo "  status         Show service status"
    echo "  cleanup        Remove containers and images (keeps data)"
    echo "  reset-db       Reset database (DESTROYS ALL DATA)"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup              # Set up environment files"
    echo "  $0 build-dev          # Build and start in development mode"
    echo "  $0 logs backend       # View backend logs"
    echo "  $0 logs               # View all logs"
}

# Main script logic
check_docker

case "${1:-help}" in
    setup)
        setup_env
        ;;
    build)
        setup_env
        build_and_start "prod"
        ;;
    build-dev)
        setup_env
        build_and_start "dev"
        ;;
    start)
        start_services "prod"
        ;;
    start-dev)
        start_services "dev"
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        view_logs "$2"
        ;;
    status)
        show_status
        ;;
    cleanup)
        cleanup
        ;;
    reset-db)
        reset_database
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
