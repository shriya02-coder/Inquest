import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './Annotate.css';

const Annotate = () => {
  const viewer = useRef(null);
 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '../files/Asynchronous Federated Optimization.pdf',
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      documentViewer.addEventListener('documentLoaded', () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser()
        });

        annotationManager.addAnnotation(rectangleAnnot);
        
        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return (
    <div className="annotateContainer">
      <div className="header">Annotate Your Paper</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default Annotate;
