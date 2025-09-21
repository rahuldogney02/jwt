import React from 'react';
import Project from './Project';

const projects = [
  {
    title: 'Project 1',
    description: 'A brief description of project 1.',
    link: '#'
  },
  {
    title: 'Project 2',
    description: 'A brief description of project 2.',
    link: '#'
  },
  {
    title: 'Project 3',
    description: 'A brief description of project 3.',
    link: '#'
  }
];

const Portfolio = () => {
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
