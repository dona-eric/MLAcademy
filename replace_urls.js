const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if(file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('/home/donerick/MLAcademy/AcademyFrontend/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // users
  content = content.replace(/["'`]\/api\/users\/me\/["'`]/g, '"/api/private/users/me/"');
  content = content.replace(/["'`]\/api\/users\/me\/enrollments\/["'`]/g, '"/api/private/learning/my-courses/"');
  content = content.replace(/["'`]\/api\/users\/apply-instructor\/["'`]/g, '"/api/private/users/apply-instructor/"');
  content = content.replace(/["'`]\/api\/users\/verify-email\//g, '"/api/public/users/verify-email/');
  content = content.replace(/`\/api\/users\/verify-email\//g, '`/api/public/users/verify-email/');
  content = content.replace(/["'`]\/api\/users\/social\/complete\/["'`]/g, '"/api/private/users/social/complete/"');
  content = content.replace(/["'`]\/api\/users\/token\/["'`]/g, '"/api/public/users/token/"');
  content = content.replace(/["'`]\/api\/users\/register\/["'`]/g, '"/api/public/users/register/"');
  content = content.replace(/["'`]\/api\/users\/logout\/["'`]/g, '"/api/private/users/logout/"');

  // specific overrides for enroll
  content = content.replace(/`\/api\/courses\/\$\{course\.id\}\/enroll\/`/g, '`/api/private/learning/enroll/${slug}/`');
  
  // courses
  content = content.replace(/["'`]\/api\/courses\//g, match => {
    return match[0] + '/api/public/courses/';
  });

  // learning
  content = content.replace(/["'`]\/api\/learning\//g, match => {
    return match[0] + '/api/private/learning/';
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
