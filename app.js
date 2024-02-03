#! /usr/bin/env node
const { Command } = require('commander');
const fs = require('fs/promises');
const path = require('path');

const program = new Command();

program
  .command('add')
  .description('Adding a cost object')
  .argument('<total>', 'Cost object add, total expense ')
  .argument('<category>', 'What are the categories?')
  .action(async (cost, category) => {
    try{
        const filePath = path.join(__dirname, 'expense.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const costs = data ? JSON.parse(data) : [];
        const lastId = costs[costs.length - 1]?.id || 0 ;
        costs.push({id: lastId + 1,  cost, category});
        fs.writeFile(filePath, JSON.stringify(costs));
        console.log('costs added');
    } catch (e){
        console.log("e:", e);
    }
  });
  program
  .command('remove <id>')
  .description('Remove a cost object by id')
  .action(async (id) => {
    try {
      const filePath = path.join(__dirname, 'expense.json');
      const data = await fs.readFile(filePath, 'utf-8');
      let costs = data ? JSON.parse(data) : [];
      const index = costs.findIndex(cost => cost.id === parseInt(id));
      if (index !== -1) {
        costs.splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(costs));
        console.log(`remove: ${id} `);
      } else {
        console.log('ID not found');
      }
    } catch (e) {
      console.error("e:", e);
    }
  });

  program
  .command('filter <category>')
  .description('Filter cost objects by category')
  .action(async (category) => {
    try {
      const filePath = path.join(__dirname, 'expense.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const costs = data ? JSON.parse(data) : [];
      const filteredCosts = costs.filter(cost => cost.category === category);
        filteredCosts.forEach(cost => {
          console.log(`${cost.cost}`);
        });
    } catch (e) {
      console.error("e", e);
    }
  });

program.parse();