export function activateTabButton(allBtns, activeBtn, { onActivate, hashPrefix, dataKey }) {
  allBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.tabIndex = -1;
  });
  activeBtn.classList.add('active');
  activeBtn.setAttribute('aria-selected', 'true');
  activeBtn.tabIndex = 0;
  onActivate(activeBtn.dataset[dataKey]);
  if (hashPrefix) history.replaceState(null, '', '#' + hashPrefix + activeBtn.dataset[dataKey]);
}
