const createBounds = ({ element, mesh }) => {
  let bounds = element.getBoundingClientRect();

  updateScale({ bounds, mesh });
  updateX({ bounds, mesh });
  updateY({ bounds, mesh });
  return bounds;
};
const updateScale = ({ bounds, mesh }) => {
  let height = bounds.height / window.innerHeight;
  let width = bounds.width / window.innerWidth;

  mesh.scale.x = window.CANVAS.Camera.width * width;
  mesh.scale.y = window.CANVAS.Camera.height * height;
};

const updateX = ({ bounds, mesh, x = 0 }) => {
  x = (bounds.left + x) / window.innerWidth;

  mesh.position.x = -window.CANVAS.Camera.width / 2 + mesh.scale.x / 2 + x * window.CANVAS.Camera.width;
};

const updateY = ({ bounds, mesh, y = 0 }) => {
  y = (bounds.top - y) / window.innerHeight;

  mesh.position.y = window.CANVAS.Camera.height / 2 - mesh.scale.y / 2 - y * window.CANVAS.Camera.height;
};

export { createBounds, updateScale, updateX, updateY };
