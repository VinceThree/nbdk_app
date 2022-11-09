import {Component, EventEmitter, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

type Playlist = {
  id: number;
  name: number;
  created_date:string;
  owner_id:number;
};

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css']
})

export class PlaylistListComponent implements OnInit {
  public playlist:Playlist[]=[];
  pageSize=3;
  public totalPages:number=0;
  public currentPage:number=1;
  public totalItems:number=0;

  public pageChangeEmitter= new EventEmitter<number>();

  constructor(private http:HttpClient,
  ) {
    this.http.get<
      {
        totalItems:number,
        playlist:[Playlist],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/playlists").subscribe(response =>{

      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;
       response.playlist.forEach(playlistEl =>{
       this.playlist.push(playlistEl);
       })
    })

  }

  ngOnInit(): void {

    this.pageChangeEmitter.subscribe(change => {
      console.log(change);
      this.playlist=[];
      this.http.get<
        {
          totalItems:number,
          playlist:[Playlist],
          totalPages:number,
          currentPage:number
        }>("http://localhost:8080/api/playlists?page="+this.currentPage+"&size=3").subscribe(response =>{
        this.totalPages=response.totalPages;
        this.totalItems=response.totalItems;
        this.currentPage=response.currentPage
        console.log(this.currentPage);
        response.playlist.forEach(playlistEl =>{
          this.playlist.push(playlistEl);
        })
      })

    })

  }
  emitNewPage(page:number){
   this.pageChangeEmitter.emit(page);
  }


}
