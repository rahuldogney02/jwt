import React from 'react';
import Project from './Project';

const projects = [
  {
    title: 'Project 1',
    description: 'A brief description of project 1.',
  },
  {
    title: 'Project 2',
    description: 'A brief description of project 2.',
  },
  {
    title: 'Project 3',
    description: 'A brief description of project 3.',
  }
];

const Portfolio = (link='#') => {
  return (
    <div className="portfolio">
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
