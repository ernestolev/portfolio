import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Squares.css';

const Squares = ({
  direction = 'right',
  speed = 1,
  borderColor = '#4C3DBD',
  squareSize = 40,
  hoverFillColor = '#532',
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const numSquaresX = useRef();
  const numSquaresY = useRef();
  const gridOffset = useRef({ x: 0, y: 0 });
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const location = useLocation();
  const [currentColor, setCurrentColor] = useState(borderColor);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const drawGrid = (ctx, canvas) => {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2 + position.x, -canvas.height / 2 + position.y);

    const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
    const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

    for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
      for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
        const squareX = x - (gridOffset.current.x % squareSize);
        const squareY = y - (gridOffset.current.y % squareSize);

        if (
          hoveredSquare &&
          Math.floor((x - startX) / squareSize) === hoveredSquare.x &&
          Math.floor((y - startY) / squareSize) === hoveredSquare.y
        ) {
          ctx.fillStyle = hoverFillColor;
          ctx.fillRect(squareX, squareY, squareSize, squareSize);
        }

        ctx.strokeStyle = currentColor;
        ctx.strokeRect(squareX, squareY, squareSize, squareSize);
      }
    }

    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, '#060606');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      
      const updateAnimation = () => {
        const effectiveSpeed = Math.max(speed, 0.1);
        switch (direction) {
          case 'right':
            gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
            break;
          case 'left':
            gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
            break;
          case 'up':
            gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
            break;
          case 'down':
            gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
            break;
          case 'diagonal':
            gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
            gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
            break;
          default:
            break;
        }
  
        drawGrid();
        requestRef.current = requestAnimationFrame(updateAnimation);
      };

      drawGrid(ctx, canvas);
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    requestRef.current = requestAnimationFrame(updateAnimation);

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY });
    };

    const handleMouseLeave = () => {
      setHoveredSquare(null);
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
    };
  }, [direction, speed, squareSize, hoveredSquare, zoom, position, currentColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let targetZoom = 1;
    let targetX = 0;
    let targetY = 0;
    let targetColor = '#4C3DBD';

    switch (location.pathname) {
      case '/projects':
        targetZoom = 2;
        targetX = -canvas.width * 0.2;
        targetY = -canvas.height * 0.2;
        targetColor = '#00FF00';
        break;
      case '/contact':
        targetZoom = 2;
        targetX = canvas.width * 0.2;
        targetY = -canvas.height * 0.2;
        targetColor = '#FFFF00';
        break;
      default:
        targetZoom = 1.1;
        targetX = 0;
        targetY = 0;
        targetColor = '#4C3DBD';
    }

    const animate = () => {
      setZoom(prev => prev + (targetZoom - prev) * 0.05);
      setPosition(prev => ({
        x: prev.x + (targetX - prev.x) * 0.05,
        y: prev.y + (targetY - prev.y) * 0.05
      }));
      setCurrentColor(prev => {
        const r = parseInt(prev.slice(1, 3), 16) + (parseInt(targetColor.slice(1, 3), 16) - parseInt(prev.slice(1, 3), 16)) * 0.05;
        const g = parseInt(prev.slice(3, 5), 16) + (parseInt(targetColor.slice(3, 5), 16) - parseInt(prev.slice(3, 5), 16)) * 0.05;
        const b = parseInt(prev.slice(5, 7), 16) + (parseInt(targetColor.slice(5, 7), 16) - parseInt(prev.slice(5, 7), 16)) * 0.05;
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
      });
    };

    const animationInterval = setInterval(animate, 16);
    return () => clearInterval(animationInterval);
  }, [location.pathname]);

  return <canvas ref={canvasRef} className="squares-canvas" />;
};

export default Squares;