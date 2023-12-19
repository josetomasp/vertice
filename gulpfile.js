const gulp = require('gulp');
const dom = require('gulp-dom');
const zip = require('gulp-zip');
const fs = require('fs');
var del = require('del');
var p = require('./package.json');
const zipArchive = 'vertice-ui-' + p.version + '.war';
const snapshotRepository = {
  url: '/nexus/content/repositories/snapshots/',
  name: 'SnapshotRepository'
};
const releaseRepository = {
  url: '/nexus/content/repositories/releases/',
  name: 'DeploymentRepository'
};

gulp.task('prepLogin', () => {
  gulp.src('dist/vertice/WEB-INF/**/*').pipe(gulp.dest('dist/WEB-INF'));
  gulp.src('dist/vertice/login.html').pipe(gulp.dest('dist/'));
  gulp.src('src/not-found-redirect.jsp').pipe(gulp.dest('dist/'));
  gulp.src('dist/vertice/login-error.html').pipe(gulp.dest('dist/'));

  del('dist/vertice/WEB-INF');
  del('dist/vertice/login-error.html');
  return del('dist/vertice/login.html');
});

gulp.task('artifacts:stamp-version', () => {
  return gulp
    .src('./dist/vertice/index.html')
    .pipe(
      dom(function() {
        return this.querySelectorAll('body')[0].setAttribute(
          'vertice-ui-version',
          p.version
        );
      })
    )
    .pipe(gulp.dest('./dist/vertice/'));
});

gulp.task(
  'artifacts:generate',
  gulp.series('artifacts:stamp-version', () => {
    var stream = fs.createWriteStream('version.properties');
    var repoInfo;

    if (p.version.indexOf('SNAPSHOT') > -1) {
      repoInfo = snapshotRepository;
    } else {
      repoInfo = releaseRepository;
    }

    stream.once('open', function(fd) {
      stream.write('version=' + p.version + '\n');
      stream.write('artifactId=' + p.name.replace(/@/g, '') + '\n');
      stream.write('groupId=' + p.groupId + '\n');
      stream.write('MODIFIED_GROUPID=' + p.groupId.replace(/\./g, '/') + '\n');
      stream.write('repositoryUrl=' + repoInfo.url + '\n');
      stream.write('repositoryName=' + repoInfo.name + '\n');
      stream.end();
    });

    return gulp
      .src('dist/**', { dot: true })
      .pipe(zip(zipArchive))
      .pipe(gulp.dest('./build/'));
  })
);
