import {Component, EventEmitter, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";


type Song = {
  id:number,
  title:string,
  artist:string
}
type User ={
  id:number,
  name:string,
  gender:string
}
type Playlist = {
  id: number;
  name: number;
  created_date:string;
  owner_id:number;
  songs_in_playlist:Song[];
  follower_of_playlist:User[];
  owner:User;
};


const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css']
})

export class PlaylistListComponent implements OnInit {
  public playlist:Playlist[]=[];
  public song:Song[]=[];
  public songAdd:Song[]=[];
  pageSize=5;
  public totalPages:number=0;
  public currentPage:number=1;
  public totalItems:number=0;
  public filterPlaylistName:string="";


  private filterValue: string="";

  constructor(private http:HttpClient,private modalService: NgbModal) {
    this.http.get<
      {
        totalItems:number,
        playlist:[Playlist],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/playlists?page="+(this.currentPage-1)+"&size="+this.pageSize).subscribe(response =>{

      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;
      this.currentPage=response.currentPage;
       response.playlist.forEach(playlistEl =>{
       this.playlist.push(playlistEl);
       })
      console.log(this.playlist);
    })

  }

  ngOnInit(): void {

  }



  selectPage(page: string) {
    this.currentPage = parseInt(page, 10) || 1;
    this.playlist=[];
    this.http.get<
      {
        totalItems:number,
        playlist:[Playlist],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/playlists?page="+(this.currentPage-1)+"&size="+this.pageSize+"&name="+this.filterPlaylistName).subscribe(response =>{
      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;

      response.playlist.forEach(playlistEl =>{
        this.playlist.push(playlistEl);
      })
      console.log(this.playlist);
    })
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  // @ts-ignore
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        // @ts-ignore
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // @ts-ignore
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  addNewPlaylist(name: string, ownerID: string) {
    this.http.post<{message:string}>("http://localhost:8080/api/playlists",{name:name,owner_id:ownerID,songs:this.songAdd}).subscribe(response => {
      this.selectPage(this.currentPage.toString());
      alert(response.message);
    })
    this.songAdd=[];
  }

  filterName(value: string) {

    this.filterPlaylistName=value;
    this.currentPage = 1
    this.playlist=[];
    this.http.get<
      {
        totalItems:number,
        playlist:[Playlist],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/playlists?page="+(this.currentPage-1)+"&size="+this.pageSize+"&name="+this.filterPlaylistName).subscribe(response =>{
      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;
      response.playlist.forEach(playlistEl =>{
        this.playlist.push(playlistEl);
      })
      console.log(this.playlist);
    })
  }

  filterSong(value: string) {
    this.filterValue=value;
    this.currentPage = 1
    this.song=[];
    this.http.get<
      {
        totalItems:number,
        songs:[Song],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/songs?page="+(this.currentPage-1)+"&size="+this.pageSize+"&title="+this.filterValue).subscribe(response =>{
      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;

      response.songs.forEach(songEl =>{
        this.song.push(songEl);
      })
      console.log(this.song);
    })
  }

  addSongToPlaylist(songEl:Song) {
    this.songAdd.push(songEl);
  }
}
