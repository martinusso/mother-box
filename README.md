# Mother Box 📦

Utility tools for Base64 encoding/decoding, JSON formatting, UUID generation, and Brazilian document generation.

## Como rodar localmente

### Opção 1: Python (Recomendado)

**Subir o servidor:**

```bash
python3 -m http.server 8000
```

**Parar o servidor:**

- Pressione `Ctrl + C` no terminal onde o servidor está rodando
- Ou execute: `pkill -f "python3 -m http.server"`

**Acessar:**
Abra seu navegador em: http://localhost:8000

### Opção 2: Node.js

**Subir o servidor:**

```bash
npx http-server -p 8000
```

**Parar o servidor:**

- Pressione `Ctrl + C` no terminal

### Opção 3: PHP

**Subir o servidor:**

```bash
php -S localhost:8000
```

**Parar o servidor:**

- Pressione `Ctrl + C` no terminal

### Opção 4: Abrir diretamente

Você pode abrir o arquivo `index.html` diretamente no navegador, mas algumas funcionalidades (como a Clipboard API) podem não funcionar corretamente sem um servidor HTTP devido a políticas de segurança do navegador.

## Funcionalidades

- **Base64**: Encode e decode texto em Base64 com suporte UTF-8
- **JSON**: Formata e valida JSON, incluindo suporte para strings JSON escapadas
- **UUID**: Gera UUIDs v4 usando crypto API
- **Brazilian Documents**: Gera CPF e CNPJ (em desenvolvimento)

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome (ícones)

## Notas

- O projeto é estático e não requer build ou instalação de dependências
- Recomenda-se usar um servidor HTTP local para todas as funcionalidades funcionarem corretamente
- Para forçar atualização no navegador após mudanças: `Ctrl + Shift + R` (Linux/Windows) ou `Cmd + Shift + R` (Mac)
