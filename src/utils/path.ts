import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { readFile } from "fs/promises";
import pathUtil from "path";

export class Path {
  private _path: string[];

  constructor(..._path: string[]) {
    this._path = _path;
  }

  /**
   * Path 객체가 가리키고 있는 경로의 전체 경로
   * @example
   * ```ts
   * new Path("a", "b", "c.txt").full; // "a/b/c.txt"
   * ```
   */
  public get full() {
    return pathUtil.join(...this._path);
  }

  /**
   * 확장자를 제외한 파일이나 디렉토리의 이름
   *
   * @example
   * ```ts
   * new Path("a", "b", "c.txt").fullname; // "c.txt"
   * new Path("a", "b", "c").fullname; // "c"
   * new Path("a", "b", "c.txt.js").fullname; // "c.txt.js"
   * new Path("a", "b", ".").fullname; // "b"
   * ```
   */
  public get name() {
    return pathUtil.basename(this.full);
  }

  /**
   * 경로의 확장자를 반환
   *
   * @example
   * ```ts
   * new Path("a", "b", "c.txt").ext; // ".txt"
   * new Path("a", "b", "c").ext; // ""
   * new Path("a", "b", "c.txt.js").ext; // ".js"
   * new Path("a", "b", ".").ext; // "b"
   * ```
   */
  public get ext() {
    return pathUtil.extname(this.full);
  }

  /**
   * 현재 경로의 부모 경로
   *
   * @example
   * ```ts
   * new Path("a", "b", "c.txt").parent; // "a/b"
   * new Path("a", "b", "c").parent; // "a/b"
   * new Path("a", "b", "c.txt.js").parent; // "a/b/c.txt.js"
   * new Path("a", "b", ".").parent; // "a/b"
   * ```
   */
  public get parent() {
    if (this._path.length < 2) {
      return new Path(pathUtil.dirname(this.full));
    }

    return new Path(...this._path.slice(0, -1));
  }

  /**
   * 현재 경로가 디렉토리인지 여부
   */
  public get isDirectory() {
    return statSync(this.full).isDirectory();
  }

  /**
   * 현재 경로가 파일인지 여부
   */
  public get isFile() {
    return statSync(this.full).isFile();
  }

  /**
   * 현재 경로가 존재하는지 여부
   */
  public get exists() {
    return existsSync(this.full);
  }

  /**
   * 현재 경로의 하위 파일 및 디렉토리 목록
   *
   */
  public get list() {
    if (!this.isDirectory) {
      throw new Error(`${this.full} is not a directory`);
    }

    return readdirSync(this.full).map((name) => this.join(name));
  }

  /**
   * 현재 경로의 하위 디렉토리 목록
   */
  public get dirs() {
    return this.list.filter((path) => path.isDirectory);
  }

  /**
   * 현재 경로의 하위 파일 목록
   */
  public get files() {
    return this.list.filter((path) => path.isFile);
  }

  /**
   * 현재 경로에 하위 경로를 추가하여 새로운 Path 객체를 반환
   */
  public join(...path: string[]) {
    return new Path(...this._path, ...path);
  }

  /**
   * 현재 경로의 파일을 동기적으로 읽어옴
   *
   * @reference https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
   */
  public readSync(options: Parameters<typeof readFileSync>[1]) {
    if (!this.isFile) {
      throw new Error(`${this.full} is not a file`);
    }

    return readFileSync(this.full, options);
  }

  /**
   * 현재 경로의 파일을 비동기적으로 읽어옴
   *
   * @reference https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
   */
  public read(options: Parameters<typeof readFile>[1]) {
    if (!this.isFile) {
      throw new Error(`${this.full} is not a file`);
    }

    return readFile(this.full, options);
  }

  /**
   * 현재 경로에 하위 경로를 추가하여 새로운 Path 객체를 반환
   */
  public resolve(...path: string[]) {
    this._path.push(...path);
    return this;
  }

  /**
   * 현재 경로와 다른 경로의 상대 경로를 반환
   */
  public relativeTo(path: Path | string) {
    const stringPath = typeof path === "string" ? path : path.full;
    return new Path(pathUtil.relative(this.full, stringPath));
  }

  /**
   * 현재 경로를 문자열로 반환
   */
  public toString() {
    return this.full;
  }

  /**
   * 현재 경로를 문자열로 반환
   */
  public valueOf() {
    return this.full;
  }
}
