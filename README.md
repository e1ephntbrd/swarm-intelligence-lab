# 🐜 Swarm Intelligence Lab

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-success)
![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Interactive visualization of emergent collective intelligence inspired by real ant colonies.

## Motivation
How do simple agents create complex logistics networks without centralized control? This project explores swarm intelligence, pheromone routing and emergent behaviour.

## Features
- Colony simulation
- Autonomous agents
- Pheromone trails
- Route discovery
- Traffic density maps
- Obstacle placement
- Multiple food sources
- Heatmap visualization

## Architecture
```mermaid
flowchart LR
Input --> World
World --> Colony
Colony --> Ant
Ant --> Sensors
Sensors --> Navigation
Navigation --> Pheromones
Pheromones --> Renderer
```

## Agent State Machine
```mermaid
stateDiagram-v2
SEARCHING --> FOUND_FOOD
FOUND_FOOD --> RETURNING_HOME
RETURNING_HOME --> SEARCHING
```

## Pheromone Model
P(t+1)=P(t)*(1-rho)

## Running
```bash
git clone https://github.com/e1ephntbrd/swarm-intelligence-lab.git
cd swarm-intelligence-lab
make up
```

## Completed
- Foundation
- World Engine
- Ant Agent
- Colony Simulation
- Pheromones
- Route Selection

## Planned
- Multi colony competition
- Weather system
- GPU acceleration
- Predators

## What I Learned
- Agent based modeling
- Swarm intelligence
- Emergent systems
- Canvas rendering
- Simulation architecture
