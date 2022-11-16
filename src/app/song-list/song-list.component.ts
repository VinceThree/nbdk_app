import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

const FILTER_PAG_REGEX = /[^0-9]/g;

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

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  public songs:Song[]=[];
  public pageSize=5;
  public totalPages:number=0;
  public currentPage:number=1;
  public totalItems:number=0;
  public filterValue:string="";
  public filterValueArtist:string='';

  constructor(private http:HttpClient, private modalService: NgbModal) {
    this.http.get<{
      totalItems:number,
      songs:[Song],
      totalPages:number,
      currentPage:number
    }>("http://localhost:8080/api/songs?page="+(this.currentPage-1)+"&size="+this.pageSize).subscribe(response => {
      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;
      this.currentPage=response.currentPage;
      response.songs.forEach(songEl =>{
        this.songs.push(songEl);
      })
    })
  }

  ngOnInit(): void {

  }

  selectPage(page: string) {
    this.currentPage = parseInt(page, 10) || 1;
    this.songs=[];
    this.http.get<
      {
        totalItems:number,
        songs:[Song],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/songs?page="+(this.currentPage-1)+"&size="+this.pageSize+"&title="+this.filterValue+"&artist="+this.filterValueArtist).subscribe(response =>{
      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;
      response.songs.forEach(songEl =>{
        this.songs.push(songEl);
      })
      console.log(this.songs);
    })
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  filterSong(value: string) {
    this.filterValue=value;
    this.currentPage = 1
    this.songs=[];
    this.http.get<
      {
        totalItems:number,
        songs:[Song],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/songs?page="+(this.currentPage-1)+"&size="+this.pageSize+"&title="+this.filterValue+"&artist="+this.filterValueArtist).subscribe(response =>{
      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;

      response.songs.forEach(songEl =>{
        this.songs.push(songEl);
      })
      console.log(this.songs);
    })
  }

  filterArtist(value: string) {

    this.filterValueArtist=value;
    this.currentPage = 1
    this.songs=[];
    this.http.get<
      {
        totalItems:number,
        songs:[Song],
        totalPages:number,
        currentPage:number
      }>("http://localhost:8080/api/songs?page="+(this.currentPage-1)+"&size="+this.pageSize+"&artist="+this.filterValueArtist).subscribe(response =>{
      this.totalPages=response.totalPages;
      this.totalItems=response.totalItems;

      response.songs.forEach(songEl =>{
        this.songs.push(songEl);
      })
      console.log(this.songs);
    })

  }

  changeSongTitle(value: string,id:number) {

      this.http.put<{ message: string }>("http://localhost:8080/api/songs/"+id,{title:value}).subscribe(response => {
        this.selectPage(this.currentPage.toString());
        alert(response.message);
      })
  }

  changeArtist(value: string,id:number) {
    this.http.put<{ message: string }>("http://localhost:8080/api/songs/"+id,{artist:value}).subscribe(response => {
      this.selectPage(this.currentPage.toString());
      alert(response.message);
    })
  }

  deleteSong(id:number) {
    this.http.delete<{message:string}>("http://localhost:8080/api/songs/"+id).subscribe(response => {
      this.selectPage(this.currentPage.toString());
      alert(response.message);
    })

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

  addNewSong(artist: string, title: string) {
    this.http.post<{message:string}>("http://localhost:8080/api/songs",{artist:artist,title:title}).subscribe(response => {
      this.selectPage(this.currentPage.toString());
      alert(response.message);
    })
  }

}
