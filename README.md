# Hexagonal Architecture – Angular Template

Minimal, opinionated Angular template implementing **Hexagonal Architecture (Ports & Adapters)**.

This repository is **pedagogical**.
Its purpose is to provide a **clean, minimal, and understandable baseline** for developers who want to start an Angular project structured around hexagonal principles without over-engineering or spending days on architectural setup.

---

## 🎯 Objective

Most Angular starters focus on tooling, UI, or state management.

This template focuses on **architecture first**:

* Clear separation between **domain**, **application**, and **infrastructure**
* Explicit **ports (interfaces)** and **adapters**
* No framework leakage inside the domain
* Minimal but real example flow

The goal is simple:

> Start a new Angular project with a hexagonal structure already in place, so you can focus on business logic instead of debating folder structures.

---

## 🧱 Architectural Principles

This template follows these constraints:

### 1. Domain is framework-agnostic

* No Angular imports
* No HttpClient
* No decorators
* No RxJS dependency inside the domain

The domain contains:

* Entities
* Value Objects
* Domain services (if needed)
* Business rules

### 2. Application orchestrates use cases

The application layer:

* Defines **use cases**
* Depends only on **ports**
* Coordinates domain objects

It does **not** depend on Angular or infrastructure details.

### 3. Infrastructure implements ports

Adapters:

* HTTP implementations
* API clients
* External systems

Infrastructure depends on Angular.
Domain never depends on infrastructure.

### 4. UI layer depends on application only

Components:

* Call use cases
* Do not access infrastructure directly
* Do not embed business logic

---

## 📁 Folder Structure

Example structure:

```
src/app
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   └── ports/
│
├── application/
│   └── use-cases/
│
├── infrastructure/
│   └── adapters/
│
└── ui/
    └── features/
```

Each layer has a single responsibility.

---

## 🧠 Why This Exists

Hexagonal architecture is often:

* Overcomplicated
* Mixed with DDD jargon
* Buried under unnecessary abstractions

This template deliberately avoids that.

It shows:

* The **minimum viable hexagonal structure**
* The cleanest possible dependency flow
* A pragmatic setup usable in real projects

No academic overload.
No enterprise ceremony.

---

## 🚀 When To Use This Template

Use this if:

* You want clean separation of concerns from day one
* You are building a medium-to-large Angular app
* You want to enforce architectural discipline
* You teach architecture or want a didactic example

Do **not** use this if:

* You are building a small landing page
* You prefer tight Angular-coupled patterns
* You want maximum speed with minimal structure

---

## 🔄 Dependency Rule

Always respect:

```
UI → Application → Domain
Infrastructure → Application (via ports)
```

Never:

```
Domain → Angular
Domain → Infrastructure
Application → Angular HTTP
```

---

## 📦 How To Use

1. Clone the repository
2. Rename the project
3. Replace the example feature with your own use case
4. Keep the layer boundaries intact

When adding new functionality:

* Create domain models first
* Define ports
* Implement use case
* Then build adapters
* Finally wire UI

Architecture before implementation.

---

## 📚 Related Content

This repository accompanies the article:

[**“Hexagonal Architecture with Angular”**](https://thomastoledo.github.io/formation/angular/typescript/javascript/training/2026/02/16/hexagonal-architecture-with-angular.html)

It provides the concrete structure discussed in that post and can serve as a base for experimentation or extension.

---

## ⚖️ Philosophy

Architecture is not about patterns.
It is about controlling dependencies.

This template exists to enforce that control from the beginning.

Minimal.
Clean.
Explicit.
