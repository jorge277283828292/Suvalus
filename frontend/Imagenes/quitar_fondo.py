from rembg import remove
from PIL import Image
import io

input_path = 'Accesorios.png'  # Cambia esto
output_path = 'sin_fondo.png'

with open(input_path, 'rb') as i:
    input_bytes = i.read()
    output_bytes = remove(input_bytes)

with open(output_path, 'wb') as o:
    o.write(output_bytes)

print("¡Fondo eliminado!")
