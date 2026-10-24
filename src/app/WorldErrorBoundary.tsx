import {Component,type ErrorInfo,type ReactNode} from 'react';
type Props={children:ReactNode};type State={failed:boolean};
export class WorldErrorBoundary extends Component<Props,State>{
 state={failed:false};
 static getDerivedStateFromError():State{return {failed:true}}
 componentDidCatch(error:Error,_info:ErrorInfo){console.error('World renderer could not start:',error.message)}
 render(){
  if(this.state.failed)return <main className="world-viewport" style={{display:'grid',placeItems:'center',padding:30,color:'#fff2d5',textAlign:'center'}}>
   <div><h1>العالم محتاج يستريح شوية</h1><p>حصلت مشكلة في عرض الرسومات. تقدري تعيدي المحاولة.</p>
    <button onClick={()=>window.location.reload()} style={{padding:'12px 23px',borderRadius:14}}>نجرب تاني ✦</button>
   </div></main>;
  return this.props.children;
 }
}
