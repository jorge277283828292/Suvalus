import os
import json

# Define categories and keywords to match in filenames
categories = {
    "Pinatas": ["pinata", "pinatas", "piñata", "piñatas"],
    "Bolsitas": ["bolsita", "bolsitas"],
    "Accesorios": ["accesorio", "accesorios"],
    "Centros_de_Mesa": ["centro", "mesa", "centros_de_mesa"],
    "Photobooth": ["photobooth"],
    "Otros": []
}

def categorize(filename):
    lower = filename.lower()
    for category, keywords in categories.items():
        for kw in keywords:
            if kw in lower:
                return category
    return "Otros"

def main():
    img_folder = "frontend/productos/Img_Productos"
    output_file = "frontend/productos/productos.json"

    # Base products to keep
    base_products = [
        {
            "nombre": "Piñata Tradicional",
            "imagen": "../Imagenes/pinata.jpg",
            "categoria": "Pinatas"
        },
        {
            "nombre": "Bolsita Sorpresa",
            "imagen": "../Imagenes/bolsita.jpg",
            "categoria": "Bolsitas"
        },
        {
            "nombre": "Accesorio Fiesta",
            "imagen": "../Imagenes/accesorio.jpg",
            "categoria": "Accesorios"
        },
        {
            "nombre": "Centro de Mesa Floral",
            "imagen": "../Imagenes/centro_mesa.jpg",
            "categoria": "Centros_de_Mesa"
        },
        {
            "nombre": "Photobooth Kit",
            "imagen": "../Imagenes/photobooth.jpg",
            "categoria": "Photobooth"
        },
        {
            "nombre": "Decoración Variada",
            "imagen": "../Imagenes/decoracion_varios.jpg",
            "categoria": "Otros"
        }
    ]

    # List all image files in Img_Productos
    files = [f for f in os.listdir(img_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]

    # Generate product entries for each image
    new_products = []
    for idx, filename in enumerate(files, start=1):
        category = categorize(filename)
        product = {
            "nombre": f"Producto {idx}",
            "imagen": f"Img_Productos/{filename}",
            "categoria": category
        }
        new_products.append(product)

    # Combine base products and new products
    all_products = base_products + new_products

    # Write to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, ensure_ascii=False, indent=2)

    print(f"Archivo {output_file} generado con {len(all_products)} productos.")

if __name__ == "__main__":
    main()
