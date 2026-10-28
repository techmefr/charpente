const select = document.querySelector<HTMLSelectElement>('#gallery-motion')
const roots = document.querySelectorAll<HTMLElement>('#gallery [data-charpente-loading]')

select?.addEventListener('change', () => {
  for (const root of roots) {
    if (select.value === '') root.removeAttribute('data-charpente-motion')
    else root.setAttribute('data-charpente-motion', select.value)
  }
})
