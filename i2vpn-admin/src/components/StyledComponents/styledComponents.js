
import styled from 'styled-components';

export const Dots = styled.div`

.dots {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-left: 40px;
  cursor: pointer;
  transition:all .5s ease-in-out;

  .Line1 ,
  .Line2 ,
  .Line3 {
      width: 25px;
      height: 3px;
      margin-bottom: 5px;
      background-color: white;
      border-radius: 1.5rem;

  }
  
}

.toggle{
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-left: 40px;
  cursor: pointer;
  transition:all .5s ease-in-out;

  .Line1 ,
   .Line2 ,
   .Line3 {
    width: 25px;
    height: 3px;
    margin-bottom: 5px;
      background-color: white;
      transition:all .5s ease-in-out;
      border-radio: 1.5rem;

  }
  .Line1 {
      transform: rotate(-45deg) translate(-5px, 5px) !important;
      transition:all .5s ease-in-out;
  }

  .Line2 {
    visibility: hidden;
      opacity: 0;
      transition: all .5s ease-in-out;
  }

  .Line3 {
      transform: rotate(45deg) translate(-5px, -7px) !important;
      transition: all .5s ease-in-out;
  }
}

`;
export const Item = styled.div`
@media screen and (max-width:1024px){
  .sidebar{
    display:none;
    height:0px !important;
    transition: all .5s ease-in-out !important;

  }
  .sidebartoggle{
    position: absolute;
    z-index: 9;
    height: 150vh !important;
    width: 100vw !important;
    transition: all .5s ease-in-out !important;

    ul.p-menu-list.p-reset{
      width: 100vw !important;
      text-algin: center;
    }
    .p-menu .p-menuitem-link{
         justify-content: center;
    }

  }
  .sidebartoggle .menu{
        width: 100vw !important;
        height:300px !important;
        transition: all .5s ease-in-out !important;
    }
  
}
.sidebar{
  transition: all .5s ease-in-out;
  height:95vh;
  background: white;
  width: 110px !important;
 
}

.p-menu .p-menuitem-link .p-menuitem-icon {
  color: gray;
  border: none;
  transition: all .5s ease-in-out;
  text-algin:center;
  padding: 12px;
  margin-right:0px !important;
}
.p-menu .p-menuitem-link .p-menuitem-icon:active{
  color: #0078d4 !important;

}
.p-menu .p-menuitem-link{
  justify-content: center;
  border-radius: 0.5rem !important;
  margin: 15px;

}
.p-menu .p-menuitem-link:active{
  color: #0078d4 !important;
}

.p-menu .p-menuitem-link:not(.p-disabled):hover .p-menuitem-icon, 
.p-menu .p-menuitem-link:not(.p-disabled):active .p-menuitem-icon {
  color: #0078d4 !important;
  box-shadow:none;
}
.p-menu .p-menuitem-link:active,
.p-menu .p-menuitem-link:focus{
  background: none;
  box-shadow:none;
  color: #0078d4 !important;
  transition: all .5s ease-in-out;
}
.p-menu .p-menuitem-link .p-menuitem-text {
  transition: all .5s ease-in-out;  
  display:none;
}

.menu{
      display: block;
      width: 110px !important;
      transition: all .5s ease-in-out;
      border: none;
  }
  .sidebartoggle{
    height:95vh;
    background: white;
    width: 185px;
    transition: all .5s ease-in-out !important;
    ul.p-menu-list.p-reset{
      width: 200px;
    }
    .menu{
      display: block;
      width: 200px;
      border: none;
      text-align:left;
      transition: all .5s ease-in-out !important;
      
      }
      .p-menu .p-menuitem-link{
          justify-content: left !important;
      }
      .p-menu .p-menuitem-link:hover{
        margin-right:25px;
      }
      .p-menu .p-menuitem-link .p-menuitem-icon { 
        transition: all .5s ease-in-out !important;
          margin-left: 0px;

      }
      .p-menu .p-menuitem-link .p-menuitem-text {
        display:block;
        color: gray;
        transition: all .5s ease-in-out !important;
        margin-left: 0px;
        font-weight: 400;
        font-size: 15px;
      }
      .p-menu .p-menuitem-link:not(.p-disabled):hover .p-menuitem-text{
        color: #0078d4 !important;
      }
  
  }
`
