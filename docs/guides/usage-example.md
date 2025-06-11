# Usage Example

This guide walks through a basic workflow for processing Postman Runner `.txt` files.

## 1. Upload files

Drag one or more `.txt` files onto the **Upload Postman Runner Files** area or click **Choose Files** to browse from your computer. Validation errors or warnings appear below the drop zone if a file is not accepted.

## 2. View results

Each file shows up in the results grid with a status badge. When processing succeeds, key details are displayed:

- Remaining files count
- Télédémarche number
- Project name
- Dossier number
- Deposit date

If a file fails to parse, an error message is shown instead of the details.

## 3. Download the JSON output

For successfully processed files, click **Download JSON** to save a structured output. A sample file looks like:

```json
{
  "nombre_fichiers_restants": 5,
  "numero_teledemarche": "TEST123",
  "nom_projet": "TRA - CODE - Example Project - v1.0",
  "numero_dossier": "123ABC",
  "date_depot": "2024-05-01"
}
```

Use these JSON files in your own tools or scripts as needed.
