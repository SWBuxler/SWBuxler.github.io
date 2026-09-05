/* The only JavaScript on the site.
   The Terminal design is a committed single theme, so there is no theme
   toggle to wire up — this just keeps the footer year honest. */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
