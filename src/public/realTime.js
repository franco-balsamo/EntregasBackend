const socket = io();

const form = document.getElementById('formProducto');
const lista = document.getElementById('listaProductos');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    title: form.title.value,
    price: parseFloat(form.price.value),
    description: "desc",
    code: "xyz",
    stock: 10,
    category: "general",
    thumbnails: []
  };
  socket.emit('nuevoProducto', data);
  form.reset();
});

socket.on('productos', productos => {

    console.log('Recibidos:', productos);
    lista.innerHTML = '';
    productos.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.title} - $${p.price}`;
    lista.appendChild(li);

    // Agregar botón de eliminar
    const btn = document.createElement('button');
    btn.textContent = "🗑️";
    btn.onclick = () => socket.emit('eliminarProducto', p.id);
    li.appendChild(btn);
  });
});
