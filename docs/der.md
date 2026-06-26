# Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    users {
        int id PK
        varchar name NOT NULL
        varchar email NOT NULL UNIQUE
        varchar password NOT NULL
        varchar cpf UNIQUE
        varchar phone
        varchar zipCode
        varchar city
        varchar state
        enum role "SUPERADMIN | ADMIN | CONTRIBUTOR"
        enum status "ACTIVE | BLOCKED"
        text banReason
        datetime createdAt
        datetime updatedAt
    }

    categories {
        int id PK
        varchar name NOT NULL UNIQUE
        datetime createdAt
        datetime updatedAt
    }

    magazines {
        int id PK
        varchar name NOT NULL
        varchar issn NOT NULL UNIQUE
        varchar officialLink NOT NULL
        varchar knowledgeArea NOT NULL
        enum qualis "A1 | A2 | A3 | A4 | B1 | B2 | B3 | B4 | C"
        boolean hasFee
        text description
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    suggestions {
        int id PK
        varchar name NOT NULL
        varchar issn NOT NULL
        varchar officialLink NOT NULL
        varchar knowledgeArea NOT NULL
        enum qualis "A1 | A2 | A3 | A4 | B1 | B2 | B3 | B4 | C"
        boolean hasFee
        text description
        enum status "PENDING | APPROVED | REJECTED"
        int contributorId FK
        text rejectionReason
        datetime createdAt
        datetime updatedAt
    }

    users ||--o{ suggestions : "envia"
```

## Descrição das Entidades

### users
Armazena todos os usuários da plataforma. O campo `role` diferencia os três perfis: `SUPERADMIN` (primeiro administrador, criado via seed), `ADMIN` (criado pelo superadmin) e `CONTRIBUTOR` (cadastrado pela plataforma). Usuários bloqueados mantêm o registro com `status = BLOCKED` e o motivo em `banReason`.

### categories
Representa as áreas do conhecimento disponíveis para classificar revistas e sugestões. Gerenciadas exclusivamente por administradores.

### magazines
Revistas científicas cadastradas e disponíveis para pesquisa pública. O campo `qualis` segue a classificação oficial da CAPES (A1 a C). Ordenadas do maior para o menor impacto nas buscas.

### suggestions
Sugestões de novas revistas enviadas por contribuidores. Ao ser aprovada (`status = APPROVED`), os dados são automaticamente copiados para a tabela `magazines`. Ao ser recusada (`status = REJECTED`), o motivo é registrado em `rejectionReason`.