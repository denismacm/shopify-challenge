const items = [];

function createItem(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="item ${item.checked ? "item_checked" : ''}"><b>Name</b>: ${item.name}<br><b>Quantity</b>: ${item.quantity}</span>
      ${item.checked ? `<span class="item-comment"><b>Comment:</b> ${item.comment}</span>` : ``}
      <div>
        <button class="js-item-edit">EDIT</button>
        ${item.checked ? 
          `<button class="js-item-restore">RESTORE</button> <button class="js-item-remove">DELETE FOREVER</button>` : 
          `<button class="js-item-delete">DELETE</button>`}
      </div>
    </li>`;
}

function updateItems() {
  $('.js-items').html(items.map((item, index) => createItem(item, index)).join(""));
}

function find(item) {
  return parseInt($(item).closest('.js-item-index-element').attr('data-item-index'), 10);
}

function handleAdd() {
  $('#js-submit').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-name').val().trim();
    if (newItemName.length == 0) return;
    $('.js-name').val('');
    const quantity = $('.js-quantity').val();
    $('.js-quantity').val('1');
    items.push({name: newItemName, quantity: quantity, checked: false, comment: "None"});
    updateItems();
  });
}

function handleEdit() {
  $('.js-items').on('click', '.js-item-edit', event => {
    const itemIndex = find(event.currentTarget);
    let newItemName = prompt("Please enter a new name for the order:", items[itemIndex].name).trim();
    if (newItemName == null) return;
    else if (newItemName == "") newItemName = items[itemIndex].name;
    let newItemQuantity;
    while (true) {
      newItemQuantity = prompt("Please enter a new quantity for the order:", "1").trim();
      if (newItemQuantity == null) return;
      else if (newItemQuantity == "") newItemQuantity = items[itemIndex].quantity;
      else if (!Number.isInteger(Number(newItemQuantity))) {
        continue;
      }
      break;
    }
    items.splice(itemIndex, 1, {name: newItemName, quantity: newItemQuantity, checked: items[itemIndex].checked, comment: items[itemIndex].comment})
    updateItems();
  });
}

function handleDelete() {
  $('.js-items').on('click', '.js-item-delete', event => { 
    const itemIndex = find(event.currentTarget);
    let comment = prompt("Please enter a deletion comment:", "Order was cancelled").trim();
    items[itemIndex].comment = (comment.length > 0 ? comment : "None");
    items[itemIndex].checked = true;
    items.push(items.splice(itemIndex, 1).pop());
    updateItems();
  });
}

function handleRestore() {
  $('.js-items').on('click', '.js-item-restore', event => {
    const itemIndex = find(event.currentTarget);
    items[itemIndex].checked = false;
    items.splice(0, 0, items.splice(itemIndex, 1)[0]);
    updateItems();
  });
}

function handleRemove() {
  $('.js-items').on('click', '.js-item-remove', event => {
    items.splice(find(event.currentTarget), 1); 
    updateItems();
  });
}

function handleAll() {
  updateItems();
  handleAdd();
  handleEdit();
  handleDelete();
  handleRestore();
  handleRemove();
}

$(handleAll);