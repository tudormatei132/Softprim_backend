# softprim-backend

API REST pentru gestionarea unui catalog de produse si plasarea de comenzi, scris in Node.js cu Express si MariaDB.

## Tehnologii

- Node.js v24.15.0
- Express 4
- MariaDB 12.2 (driver `mysql2/promise`)
- dotenv

## Structura proiectului

```
.
├── .env.example
├── package.json
├── setup.sql
└── src/
    ├── server.js              # bootstrap — incarca .env, porneste Express
    ├── app.js                 # configurare Express, montare routere si middleware
    ├── db.js                  # pool de conexiuni MariaDB
    ├── routes/                # definirea rutelor HTTP
    ├── controllers/           # parsarea cererii, apel service, formatare raspuns
    ├── services/              # logica de business + queries SQL
    ├── validators/            # validarea inputului (query, body, params)
    └── middleware/
        ├── notFound.js        # 404 pentru rute neinregistrate
        └── errorHandler.js    # transforma erorile aruncate in raspunsuri JSON
```

Fluxul unei cereri: `route → controller → validator → service → db`.

## Setup

1. Instaleaza dependentele:
   ```bash
   npm install
   ```

2. Creeaza un fisier `.env` pornind de la `.env.example`:
   ```env
   PORT=3000

   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=parola_ta
   DB_NAME=softprim_test
   ```

3. Creeaza baza de date si importa schema + datele din `setup.sql`:
   ```bash
   mysql -u root -p -e "CREATE DATABASE softprim_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p softprim_test < setup.sql
   ```
   Vei avea trei tabele populate: `categories` (5 categorii), `products` (20 produse) si `orders` (gol).

4. Porneste serverul:
   ```bash
   npm run dev      # cu auto-reload (--watch)
   npm start        # rulare normala
   ```

   Serverul asculta la `http://localhost:3000` (sau portul setat in `PORT`).

## Endpoint-uri

### `GET /api/products`

Listeaza produsele. Accepta filtru optional pe categorie ca **query string**.

```http
GET /api/products
GET /api/products?category_id=1
```

Categoriile disponibile (din tabela `categories`): `1` Intrerupatoare automate, `2` Contoare electrice, `3` Relee de monitorizare, `4` Tablouri electrice, `5` Conectori si accesorii.

Exemplu `curl`:
```bash
curl 'http://localhost:3000/api/products?category_id=2'
```

Raspuns:
```json
[
  {
    "id": 6,
    "name": "Contor electric monofazat digital 5(60)A",
    "price": 175,
    "stock": 50,
    "category_id": 2,
    "category_name": "Contoare electrice"
  },
  {
    "id": 7,
    "name": "Contor electric trifazat 3x230/400V",
    "price": 420,
    "stock": 25,
    "category_id": 2,
    "category_name": "Contoare electrice"
  },
  {
    "id": 8,
    "name": "Contor electric monofazat MID certificat",
    "price": 245,
    "stock": 35,
    "category_id": 2,
    "category_name": "Contoare electrice"
  }
]
```

``` bash
curl http://localhost:3000/api/products
```

``` json
[
  {
    "id": 1,
    "name": "Siguranță automată 1P+N 16A curba C",
    "price": 45.5,
    "stock": 120,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  },
  {
    "id": 2,
    "name": "Siguranță automată 1P+N 25A curba C",
    "price": 52,
    "stock": 85,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  },
  {
    "id": 3,
    "name": "Siguranță automată tetrapolară 4P 32A",
    "price": 189,
    "stock": 40,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  },
  {
    "id": 4,
    "name": "Siguranță automată diferențială 2P 25A 30mA",
    "price": 145.5,
    "stock": 52,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  },
  {
    "id": 5,
    "name": "AFDD detector arc electric 1P+N 16A",
    "price": 320,
    "stock": 15,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  },
  {
    "id": 6,
    "name": "Contor electric monofazat digital 5(60)A",
    "price": 175,
    "stock": 50,
    "category_id": 2,
    "category_name": "Contoare electrice"
  },
  {
    "id": 7,
    "name": "Contor electric trifazat 3x230/400V",
    "price": 420,
    "stock": 25,
    "category_id": 2,
    "category_name": "Contoare electrice"
  },
  {
    "id": 8,
    "name": "Contor electric monofazat MID certificat",
    "price": 245,
    "stock": 35,
    "category_id": 2,
    "category_name": "Contoare electrice"
  },
  {
    "id": 9,
    "name": "Releu monitorizare tensiune trifazat",
    "price": 285,
    "stock": 30,
    "category_id": 3,
    "category_name": "Relee de monitorizare"
  },
  {
    "id": 10,
    "name": "Releu monitorizare lipsa fază 3x400V",
    "price": 210.5,
    "stock": 45,
    "category_id": 3,
    "category_name": "Relee de monitorizare"
  },
  {
    "id": 11,
    "name": "Releu de timp multifuncțional 16 funcții",
    "price": 165,
    "stock": 55,
    "category_id": 3,
    "category_name": "Relee de monitorizare"
  },
  {
    "id": 12,
    "name": "Tablou electric metalic IP55 12 module",
    "price": 189,
    "stock": 20,
    "category_id": 4,
    "category_name": "Tablouri electrice"
  },
  {
    "id": 13,
    "name": "Tablou inox IP65 24 module aplicat",
    "price": 485,
    "stock": 8,
    "category_id": 4,
    "category_name": "Tablouri electrice"
  },
  {
    "id": 14,
    "name": "Tablou electric PVC 8 module aplicat",
    "price": 55,
    "stock": 100,
    "category_id": 4,
    "category_name": "Tablouri electrice"
  },
  {
    "id": 15,
    "name": "Tablou metalic distribuție 36 module",
    "price": 320,
    "stock": 18,
    "category_id": 4,
    "category_name": "Tablouri electrice"
  },
  {
    "id": 16,
    "name": "Conector cupru-aluminiu 16-95 mmp",
    "price": 28.5,
    "stock": 200,
    "category_id": 5,
    "category_name": "Conectori și accesorii"
  },
  {
    "id": 17,
    "name": "Separator de sarcină 4P 63A tetrapolar",
    "price": 145,
    "stock": 35,
    "category_id": 5,
    "category_name": "Conectori și accesorii"
  },
  {
    "id": 18,
    "name": "Bară de nul cu 12 borne pentru tablou",
    "price": 18,
    "stock": 150,
    "category_id": 5,
    "category_name": "Conectori și accesorii"
  },
  {
    "id": 19,
    "name": "Cleme șir 2.5mmp gri (set 50 buc)",
    "price": 32,
    "stock": 75,
    "category_id": 5,
    "category_name": "Conectori și accesorii"
  },
  {
    "id": 20,
    "name": "Conector de derivație 6mmp izolat",
    "price": 4.5,
    "stock": 500,
    "category_id": 5,
    "category_name": "Conectori și accesorii"
  }
]
```

Daca `category_id` este valid dar nu are produse asociate, raspunsul este array gol `[]`.

Erori posibile:
- `400 Bad Request` — `category_id` gol (`?category_id=`) → `{"error":"category_id is required"}`
- `400 Bad Request` — `category_id` non-numeric, negativ sau zero → `{"error":"category_id must be a positive integer"}`

### `GET /api/products/:id`

Returneaza un produs dupa id.

```http
GET /api/products/4
```

Exemplu `curl`:
```bash
curl http://localhost:3000/api/products/4
```

Raspuns `200 OK`:
```json
{
  "id": 4,
  "name": "Siguranță automată diferențială 2P 25A 30mA",
  "price": 145.5,
  "stock": 52,
  "category_id": 1,
  "category_name": "Întrerupătoare automate",
  "created_at": "2026-05-09 11:54:24"
}
```

Erori posibile:
- `400 Bad Request` — id non-numeric, negativ sau zero → `{"error":"product_id must be a positive integer"}`
- `404 Not Found` — id valid dar inexistent in DB → `{"error":"Product not found"}`

### `POST /api/orders`

Creeaza o comanda. Tranzactia scade stocul si calculeaza totalul pe server.

Body:
```json
{
  "product_id": 5,
  "quantity": 3,
  "customer_email": "client@exemplu.ro"
}
```

Exemplu `curl`:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"product_id": 5, "quantity": 3, "customer_email": "client@exemplu.ro"}'
```

Raspuns `201 Created`:
```json
{
  "order_id": 1,
  "product_id": 5,
  "quantity": 3,
  "total": 960,
  "created_at": "2026-05-09 12:25:38"
}
```


Totalul este calculat pe server ca `price * quantity` (in exemplul de mai sus, `320 * 3 = 960`). Operatia este atomica: insertul comenzii si scaderea stocului se fac intr-o tranzactie cu `SELECT ... FOR UPDATE`.

Erori posibile:
- `400 Bad Request` — body lipsa sau non-JSON → `{"error":"Request body must be a JSON object"}`
- `400 Bad Request` — `product_id` lipsa, non-intreg, negativ sau zero → `{"error":"product_id must be a positive integer"}`
- `400 Bad Request` — `quantity` lipsa, non-intreg, negativ sau zero → `{"error":"quantity must be a positive integer"}`
- `400 Bad Request` — `customer_email` lipsa, gol sau non-string → `{"error":"Email is required"}`
- `400 Bad Request` — `customer_email` peste 150 caractere → `{"error":"Email must not exceed 150 characters"}`
- `400 Bad Request` — `customer_email` cu format invalid → `{"error":"Invalid email format"}`
- `400 Bad Request` — `quantity` mai mare decat stocul → `{"error":"Insufficient stock"}`
- `404 Not Found` — `product_id` inexistent in DB → `{"error":"Product not found"}`

## Format erori

Toate erorile au acelasi format:
```json
{ "error": "mesaj descriptiv" }
```

Coduri folosite:
- `400 Bad Request` — input invalid (vezi listele per endpoint)
- `404 Not Found` — resursa lipsa (`Product not found`) sau ruta inexistenta (`Route not found`, ex. `GET /api/foo`)
- `500 Internal Server Error` — eroare neasteptata pe server (ex. probleme de conexiune cu MariaDB); raspunsul contine mesajul tehnic al erorii

## Note

- Pentru cereri GET, parametrii se trimit in **URL ca query string** (`?category_id=1`), nu in body.
- Stocul se decrementeaza atomic la crearea comenzii (folosind `SELECT ... FOR UPDATE` intr-o tranzactie).
- Conexiunile la MariaDB sunt servite dintr-un pool (`mysql2.createPool`).
