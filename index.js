const electron = require('electron');
const{app,BrowserWindow,Menu,ipcMain} = electron;

let mainWindow;
let addWindow;

app.on('ready',()=>{
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  //forcibly the entire application
  mainWindow.on('closed',()=>app.quit());
//new todo browser window


  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed',()=>addWindow = null);
}

ipcMain.on('todo:add',(event,todo)=>{
  mainWindow.webContents.send('todo:add',todo);
  //we still have a reference to add window
  addWindow.close();
});



//menu template
const menuTemplate = [
  {
      label:'File',
      submenu: [
        {label: 'New Todo',
        accelerator:'Command + N',
        click(){createAddWindow();}
      },
      {
        label:'Clear Todos',
        accelerator:'Command + C',
        click(){
          //const {ipcRenderer} = electron;
          mainWindow.webContents.send('todo:clear');
          }

        },
        {label: 'Quit',
        accelerator:process.platform === 'darwin'? 'Command + Q':'Ctrl+Q',
        click(){
          app.quit();
        }
      }
      ]
  }
];
if(process.platform === 'darwin'){
  menuTemplate.unshift({label:''});
}
if(process.env.NODE_ENV !== 'production')
{
  //'production'
  //'development'
  //'test'
  menuTemplate.push({
    label:'View',
    submenu:[
      {
      label:'Toggle Developer Tools',
      accelerator: process.platform === 'darwin'? 'Command + Alt + I':'Ctrl+Shift+I',
      click(item,focusedWindow){
        focusedWindow.toggleDevTools();

      }
    },
      {
        role:'reload'
      }
  ]
  });
}
