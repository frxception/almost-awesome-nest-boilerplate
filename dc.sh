#!/bin/bash

# Docker Compose convenience script
# Usage: ./dc.sh [up|kill|restart|logs|status]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if docker-compose is available
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose is not installed or not available in PATH"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Docker Compose convenience script for Almost Awesome NestJS Boilerplate"
    echo ""
    echo "Usage: ./dc.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  up      Start all services in detached mode (docker-compose up -d)"
    echo "  kill    Stop and remove all containers (docker-compose down)"
    echo "  restart Restart all services (kill + up)"
    echo "  logs    Show logs from all services"
    echo "  status  Show status of all containers"
    echo "  help    Show this help message"
    echo ""
    echo "Options:"
    echo "  --build   Force rebuild when using 'up' command"
    echo "  --volumes Remove volumes when using 'kill' command"
    echo ""
    echo "Examples:"
    echo "  ./dc.sh up              # Start all services"
    echo "  ./dc.sh up --build      # Start services with rebuild"
    echo "  ./dc.sh kill            # Stop all services"
    echo "  ./dc.sh kill --volumes  # Stop services and remove volumes"
    echo "  ./dc.sh restart         # Restart all services"
    echo "  ./dc.sh logs            # Show logs"
    echo "  ./dc.sh status          # Show container status"
}

# Function to start services
start_services() {
    local build_flag=""
    
    if [[ "$2" == "--build" ]]; then
        build_flag="--build"
        print_info "Starting services with rebuild..."
    else
        print_info "Starting services..."
    fi
    
    if $DOCKER_COMPOSE_CMD up -d $build_flag; then
        print_success "Services started successfully!"
        echo ""
        print_info "Available services:"
        echo "  📱 Application: http://localhost:3000"
        echo "  📚 API Documentation: http://localhost:3000/documentation"
        echo "  🗄️  pgAdmin: http://localhost:8080 (admin@admin.com / admin)"
        echo ""
        print_info "Run './dc.sh logs' to see logs or './dc.sh status' to check status"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Function to stop services
stop_services() {
    local volumes_flag=""
    
    if [[ "$2" == "--volumes" ]]; then
        volumes_flag="--volumes"
        print_warning "Stopping services and removing volumes (data will be lost)..."
    else
        print_info "Stopping services..."
    fi
    
    if $DOCKER_COMPOSE_CMD down $volumes_flag; then
        print_success "Services stopped successfully!"
    else
        print_error "Failed to stop services"
        exit 1
    fi
}

# Function to restart services
restart_services() {
    print_info "Restarting services..."
    stop_services
    sleep 2
    start_services
}

# Function to show logs
show_logs() {
    print_info "Showing logs from all services (press Ctrl+C to exit)..."
    $DOCKER_COMPOSE_CMD logs -f
}

# Function to show status
show_status() {
    print_info "Container status:"
    $DOCKER_COMPOSE_CMD ps
}

# Main script logic
main() {
    # Check if docker-compose is available
    check_docker_compose
    
    # Handle empty arguments
    if [[ $# -eq 0 ]]; then
        print_warning "No command specified"
        show_help
        exit 1
    fi
    
    # Handle commands
    case $1 in
        "up")
            start_services "$@"
            ;;
        "kill")
            stop_services "$@"
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"