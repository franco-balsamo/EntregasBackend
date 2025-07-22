const socket = io();

const form = document.getElementById('formProducto');
const lista = document.getElementById('listaProductos');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
  title: form.elements['title'].value,
  price: parseFloat(form.elements['price'].value),
  description: form.elements['description'].value,
  code: form.elements['code'].value,
  stock: parseFloat(form.elements['stock'].value),
  category: form.elements['category'].value,
  thumbnails: []
  };

  socket.emit('nuevoProducto', data);
  form.reset();
});

socket.on('productos', productos => {
  console.log('Recibidos:', productos);
  lista.innerHTML = ''; // lista puede ser un <div id="lista">

  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'producto-card';

    card.innerHTML = `
      <img src="${p.thumbnails[0]}" alt="${p.title}" class="producto-img" />
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p><strong>Categoría:</strong> ${p.category}</p>
      <p><strong>Código:</strong> ${p.code}</p>
      <p><strong>Stock:</strong> ${p.stock}</p>
      <p><strong>Precio:</strong> $${p.price}</p>
    `;

    const btn = document.createElement('button');
    btn.textContent = "Eliminar";
    btn.onclick = () => socket.emit('eliminarProducto', p.id);
    btn.className = 'btn-eliminar';
    card.appendChild(btn);

    lista.appendChild(card);
  });
});

