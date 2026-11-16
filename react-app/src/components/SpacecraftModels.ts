import * as THREE from 'three';

/* Detailed, self-contained replicas of the six craft already in the original app.
   Proportions and recognizable components are based on NASA mission hardware,
   not generic cubes. No change to diagnostic behaviour or app content. */
export interface ModelOptions { xrayMode: boolean; dustLevel: number; timelineYear: number; }
export interface BuiltCraft { craft: THREE.Group; animatedParts: Array<(t: number) => void>; }

export function buildSpacecraft(relicId: string, {xrayMode, dustLevel, timelineYear}: ModelOptions): BuiltCraft {
  const craft = new THREE.Group();
  const animatedParts: Array<(t: number) => void> = [];
  const dust = new THREE.Color(relicId === 'opportunity-rover' || relicId === 'ingenuity-heli' ? 0x9a573d : 0x8f989e);
  const mix = Math.min(.48, dustLevel/200);
  const material = (color: number, metalness=.55, roughness=.43, glass=false) => {
    const shade = new THREE.Color(color).lerp(dust, mix);
    return new THREE.MeshStandardMaterial({
      color: xrayMode ? 0x39d3ee : shade,
      metalness: xrayMode ? .15 : metalness, roughness,
      transparent: xrayMode || glass,
      opacity: xrayMode ? .53 : glass ? .78 : 1,
      wireframe: xrayMode && !glass,
      side: THREE.DoubleSide
    });
  };
  const white = material(0xdfe3e1, .65, .4);
  const bright = material(0xf4f0df, .55, .4);
  const gray = material(0x828d92, .7, .35);
  const dark = material(0x30353a, .18, .8);
  const black = material(0x151f2d, .32, .47);
  const gold = material(0xbf8b3e, .65, .6);
  const foil = material(0xe1b35f, .7, .57);
  const blue = material(0x174c86, .42, .35);
  const cell = material(0x142c51, .34, .4);
  const lensMat = material(0x113b55, .08, .2, true);
  const copper = material(0x94592e, .75, .34);
  const rubber = material(0x343536, .1, .89);
  const coreMat = new THREE.MeshStandardMaterial({color: 0xe64e78, emissive: 0x8a183c, emissiveIntensity: xrayMode ? .8 : .06, metalness: .1, roughness: .5});

  const add = <T extends THREE.Object3D>(obj: T, parent: THREE.Group | THREE.Object3D = craft): T => { parent.add(obj); return obj; };
  const box = (w: number, h: number, d: number, mat: THREE.Material, pos: [number,number,number], parent: THREE.Object3D = craft) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    mesh.position.set(...pos); return add(mesh, parent);
  };
  const cylinder = (r: number, length: number, mat: THREE.Material, pos: [number,number,number], count=20, parent: THREE.Object3D=craft) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r,r,length,count),mat);
    m.position.set(...pos); return add(m,parent);
  };
  const rod = (start: [number,number,number], end: [number,number,number], radius: number, mat: THREE.Material, parent: THREE.Object3D = craft, detail=8) => {
    const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
    const diff = b.clone().sub(a);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,diff.length(),detail), mat);
    beam.position.copy(a).add(b).multiplyScalar(.5);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),diff.normalize());
    return add(beam,parent);
  };
  const ball = (r: number, mat: THREE.Material, pos: [number,number,number], parent: THREE.Object3D=craft) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r,12,10),mat);
    mesh.position.set(...pos); return add(mesh,parent);
  };
  const panel = (w: number, d: number, pos: [number,number,number], mount: THREE.Object3D = craft, rows=7, cols=9) => {
    const group = add(new THREE.Group(), mount);
    group.position.set(...pos);
    box(w,.065,d,white,[0,0,0],group);
    box(w-.055,.069,d-.055,cell,[0,.025,0],group);
    for(let i=1;i<cols;i++) box(.009,.073,d-.06,blue,[(i/cols-.5)*(w-.05),.065,0],group);
    for(let i=1;i<rows;i++) box(w-.06,.073,.008,gray,[0,.065,(i/rows-.5)*(d-.05)],group);
    return group;
  };
  const dish = (r: number, pos: [number,number,number], mount: THREE.Object3D = craft, m: THREE.Material = white) => {
    const group = add(new THREE.Group(),mount);
    group.position.set(...pos);
    // Shallow paraboloid: genuinely curved concave mesh, not a cone.
    const profile = [] as THREE.Vector2[];
    for(let i=0;i<=18;i++) {
      const rr = r*i/18;
      profile.push(new THREE.Vector2(rr, .12 + .38*(rr/r)*(rr/r)));
    }
    add(new THREE.Mesh(new THREE.LatheGeometry(profile,64), m.clone()),group);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r,.022,7,64),gray);
    rim.rotation.x=Math.PI/2; rim.position.y=.50; add(rim,group);
    [[.66,0],[-.33,.57],[-.33,-.57]].forEach(([xx,zz])=>rod([xx*r,.35,zz*r],[0,1.05,0],.015,gray,group));
    cylinder(.075,.14,black,[0,1.05,0],12,group);
    return group;
  };
  const wheel = (x:number,z:number,y:number,r:number, thin=false) => {
    const group = add(new THREE.Group()); group.position.set(x,y,z);
    // Axle normal is Z; tire has visible mesh + cleats like NASA rovers.
    const tireMat = thin ? gray : rubber;
    add(new THREE.Mesh(new THREE.TorusGeometry(r*.83,r*.135,11,32),tireMat),group);
    add(new THREE.Mesh(new THREE.TorusGeometry(r*.52,r*.035,7,32),gray),group);
    cylinder(r*.28,.13,gray,[0,0,0],16,group).rotation.x=Math.PI/2;
    for(let i=0;i<12;i++) {
      const a = i/12*Math.PI*2;
      rod([Math.cos(a)*r*.28,Math.sin(a)*r*.28,0],[Math.cos(a)*r*.80,Math.sin(a)*r*.80,0],.015,gray,group);
    }
    for(let i=0;i<20;i++) {
      const a=i/20*Math.PI*2;
      const cleat=box(r*.22,.03,r*.15,white,[Math.cos(a)*r*.89,Math.sin(a)*r*.89,0],group);
      cleat.rotation.z=a;
    }
    return group;
  };
  const ribbedRTG = (pos:[number,number,number], rotZ=0) => {
    const g=add(new THREE.Group()); g.position.set(...pos); g.rotation.z=rotZ;
    cylinder(.16,.68,gray,[0,0,0],20,g);
    for(let i=0;i<10;i++) cylinder(.24,.024,dark,[0,(i-4.5)*.062,0],20,g);
    cylinder(.10,.8,white,[0,0,0],12,g);
    return g;
  };
  const canister = (pos:[number,number,number],size:[number,number,number],mat:THREE.Material=foil) => {
    const m=box(...size,mat,pos);
    // Overlaid diagonal foil folds (real insulation has irregular seam edges)
    const [w,h,d]=size;
    for(let i=-2;i<=2;i++) rod([pos[0]-w*.49,pos[1]+i*h*.18,pos[2]+d*.505],[pos[0]+w*.49,pos[1]+(i+1)*h*.18,pos[2]+d*.505],.007,gold);
    return m;
  };

  if(relicId === 'apollo-lrv') {
    // NASA Apollo LRV: open aluminium folding chassis, four open mesh wheels,
    // side-by-side seats, front hinged console, dish and rear equipment palette.
    [-.70,.70].forEach(z=>rod([-1.33,-.21,z],[1.32,-.21,z],.045,white));
    [-1.22,0,1.2].forEach(x=>rod([x,-.22,-.76],[x,-.22,.76],.035,white));
    box(2.56,.07,1.36,black,[0,-.28,0]);
    canister([-1,-.10,0],[.65,.34,1.05],gold);
    if (xrayMode) box(.43,.29,.84,coreMat,[-1,-.09,0]);
    box(.64,.09,1.15,white,[.65,-.12,0]);
    [-.38,.38].forEach(z=>{
      box(.56,.10,.52,white,[.30,.07,z]);
      box(.09,.56,.55,gray,[.02,.30,z]);
      box(.51,.07,.46,material(0x8d8b83,.05,.9),[.27,.14,z]);
      rod([.50,.20,z-.20],[.5,.48,z-.20],.027,white);
    });
    const screen=box(.18,.3,.72,gray,[.96,.35,0]); screen.rotation.z=-.19;
    rod([.95,.15,0],[1.05,.7,0],.025,gray);
    rod([.87,.72,-.23],[1.19,.72,-.23],.023,black);
    [-.88,.88].forEach(x=>[-.81,.81].forEach(z=>{
      wheel(x,z,-.61,.29,true);
      rod([x*.72,-.23,z*.58],[x,-.61,z],.05,white);
      rod([x*.84,-.34,z*.58],[x*.66,-.12,z*.25],.027,gray);
    }));
    // HGA with real wire ribs and central feed, forward right.
    rod([1.05,.0,-.55],[1.05,.83,-.55],.025,gray);
    const highGain=dish(.38,[1.05,.8,-.55]); highGain.rotation.z=.20;
    highGain.traverse(o=>{if(o instanceof THREE.Mesh && o.geometry instanceof THREE.LatheGeometry){(o.material as THREE.MeshStandardMaterial).wireframe=true;}});
    rod([.88,.11,.55],[.9,.88,.55],.026,white);
    box(.23,.2,.2,white,[.9,.87,.55]);
    cylinder(.075,.10,lensMat,[1.06,.87,.55]).rotation.z=Math.PI/2;
    box(.54,.17,.8,gray,[-.93,.03,.05]);
    [-.33,.33].forEach(z=>rod([-1.22,-.16,z],[-1.22,.4,z],.032,white));
  } else if(relicId === 'opportunity-rover') {
    // MER-B: six-wheel rocker-bogie, folded butterfly solar array, mast stereo
    // eyes, high gain antenna, gold bus and science arm.
    canister([.02,-.02,0],[1.1,.52,.88]);
    if (xrayMode) box(.61,.33,.45,coreMat,[.02,-.02,0]);
    box(1.24,.12,.93,gray,[0,.3,0]);
    // Decks are polygonal, extended wing panels rather than three generic boxes.
    panel(1.19,.91,[0,.38,0],craft,6,8);
    [-1,1].forEach(side=>{
      const wing=panel(1.45,.78,[-.18,.36,side*1.00],craft,5,9);
      wing.rotation.y=side*.22; wing.rotation.x=side*.055;
      const aft=panel(.59,.55,[-.98,.37,side*.53],craft,4,5);
      aft.rotation.y=-side*.18;
    });
    [-1,1].forEach(side=>{
      [-.75,0,.74].forEach((x,ind)=>{
        wheel(x,side*.86,-.6,.22);
        rod([x*.63,-.19,side*.47],[x,-.60,side*.86],.046,gray);
        if(ind!==1)rod([0,-.27,side*.62],[x,-.48,side*.83],.035,white);
      });
      rod([-.72,-.43,side*.81],[.69,-.43,side*.81],.02,gray);
    });
    rod([.33,.35,.14],[.36,1.24,.14],.056,gray);
    box(.48,.18,.35,white,[.36,1.24,.14]);
    [-.105,.105].forEach(z=>{
      cylinder(.072,.082,lensMat,[.62,1.25,.14+z],16).rotation.z=Math.PI/2;
      cylinder(.084,.02,gray,[.665,1.25,.14+z],16).rotation.z=Math.PI/2;
    });
    rod([-.43,.34,0],[-.43,.93,0],.018,white);
    const hga=dish(.24,[-.44,.83,-.06]); hga.rotation.z=-.37;
    // Instrument deployment device, visible front arm and end tool turret.
    rod([.63,-.02,-.25],[.99,-.27,-.38],.07,white);
    rod([.99,-.27,-.38],[1.4,-.52,-.5],.045,gray);
    cylinder(.16,.19,gold,[1.40,-.54,-.5],18).rotation.z=Math.PI/2;
    ball(.07,black,[1.52,-.54,-.5]);
    box(.24,.14,.18,gray,[-.5,.54,.53]);
  } else if(relicId === 'ingenuity-heli') {
    canister([0,-.02,0],[.64,.48,.56]);
    box(.62,.08,.57,black,[0,.26,0]);
    // Black upper solar-cell array with silver frame.
    panel(1.22,.61,[0,1.29,0],craft,4,9);
    rod([0,.25,0],[0,1.26,0],.046,white);
    const rotor1=add(new THREE.Group()); rotor1.position.y=1.09;
    const rotor2=add(new THREE.Group()); rotor2.position.y=.92;
    for(const [i,g] of [rotor1,rotor2].entries()){
      for(let b=0;b<2;b++){
        const blade=box(1.33,.025,.145,black,[(b ? -1 : 1)*.68,0,0],g);
        blade.rotation.y=(b ? Math.PI : 0);
        blade.rotation.z=(b ? -1 : 1)*.045;
        // White leading-edge stripe typical of NASA rotor visualisations.
        box(1.12,.012,.016,gray,[(b ? -1 : 1)*.69,.021,-.05],g);
      }
      cylinder(.10,.12,gray,[0,0,0],14,g);
      g.rotation.y=i*Math.PI/2;
    }
    [-1,1].forEach(sx=>[-1,1].forEach(sz=>{
      rod([sx*.24,-.20,sz*.22],[sx*.86,-.78,sz*.75],.021,white);
      rod([sx*.86,-.78,sz*.75],[sx*.95,-.80,sz*.81],.028,gray);
      rod([sx*.22,-.23,sz*.21],[sx*.64,-.62,sz*.54],.013,gray);
    }));
    cylinder(.08,.10,lensMat,[0,-.32,0],14);
    if(timelineYear<2024) animatedParts.push(t=>{rotor1.rotation.y=t*11;rotor2.rotation.y=-t*11+Math.PI/3;});
  } else if(relicId === 'surveyor-lrrr') {
    // Surveyor 3 lander site with a more recognizable tripod chassis and the Apollo LRRR panel.
    const surveyor = add(new THREE.Group());
    surveyor.position.set(-.95,-.03,.02);

    // Central equipment bay with gold foil around the surveyor body.
    const bay = add(new THREE.Group(), surveyor);
    box(.58,.34,.48,gold,[0,.10,0],bay);
    box(.48,.26,.38,dark,[0,.11,0],bay);
    box(.62,.04,.52,white,[0,.30,0],bay);
    cylinder(.12,.28,gray,[0,-.10,0],6,bay);
    for(let a=0;a<3;a++){
      const ang = a*Math.PI*2/3 + Math.PI/6;
      const fx = Math.cos(ang)*1.10;
      const fz = Math.sin(ang)*1.10;
      rod([0,.22,0],[fx,-.75,fz],.035,white,surveyor);
      rod([0,.02,0],[fx,-.75,fz],.02,gray,surveyor);
      rod([Math.cos(ang)*.28,.24,Math.sin(ang)*.28],[fx*.66,-.20,fz*.66],.014,gray,surveyor);
      const pad = cylinder(.17,.05,white,[fx,-.79,fz],28,surveyor);
      pad.rotation.x = Math.PI/10;
      const shock = cylinder(.03,.20,gray,[fx*.76,-.48,fz*.76],10,surveyor);
      shock.lookAt(new THREE.Vector3(fx,-.79,fz));
    }

    // Vernier thrusters/nozzles under the lander.
    for(let a=0;a<3;a++){
      const ang = a*Math.PI*2/3;
      const x = Math.cos(ang)*.26;
      const z = Math.sin(ang)*.26;
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(.07,.18,14), gray);
      nozzle.position.set(x,-.30,z);
      nozzle.rotation.x = Math.PI;
      add(nozzle, surveyor);
    }

    // Omnidirectional / high-gain dish and camera mast.
    rod([0,.30,0],[0,1.03,0],.025,white,surveyor);
    const sDish = dish(.34,[.05,.90,.02],surveyor,white);
    sDish.rotation.z = -.28;
    sDish.rotation.y = .22;
    rod([0,.64,0],[.42,.56,.28],.02,gray,surveyor);
    const camera = add(new THREE.Group(), surveyor);
    camera.position.set(.42,.56,.28);
    box(.16,.18,.14,white,[0,0,0],camera);
    cylinder(.07,.09,lensMat,[.11,.02,0],16,camera).rotation.z = Math.PI/2;
    rod([.36,.36,-.16],[.78,.05,-.46],.035,white,surveyor);
    rod([.78,.05,-.46],[1.16,-.24,-.66],.025,gray,surveyor);
    box(.18,.10,.14,gray,[1.20,-.26,-.69],surveyor);
    box(.05,.02,.13,white,[1.30,-.27,-.69],surveyor);

    // Small top solar panel and side equipment boxes.
    panel(.36,.22,[-.18,.63,-.12],surveyor,3,4).rotation.z = .2;
    box(.15,.10,.22,gray,[-.31,.08,.30],surveyor);
    box(.14,.18,.10,gray,[.18,.00,-.32],surveyor);

    // Apollo LRRR as a dedicated prism array on a simple frame.
    const reflector = add(new THREE.Group());
    reflector.position.set(1.22,-.50,.20);
    reflector.rotation.x = -.46;
    box(.88,.07,.63,gray,[0,0,0],reflector);
    box(.76,.07,.53,black,[0,.046,0],reflector);
    for(let i=0;i<8;i++)for(let j=0;j<5;j++){
      const prism = box(.075,.017,.075,bright,[-.33+i*.095,.095,-.19+j*.095],reflector);
      prism.rotation.y = ((i+j)%2 ? .12 : -.08);
    }
    rod([1.22,-.77,.20],[1.22,-.52,.20],.05,gray);
    rod([.98,-.76,.02],[1.22,-.58,.20],.02,gray);
    rod([1.46,-.76,.02],[1.22,-.58,.20],.02,gray);
    rod([1.22,-.76,.44],[1.22,-.58,.20],.02,gray);

    // Retain the original pulsing laser diagnostic visual.
    const laserMaterial = new THREE.MeshBasicMaterial({color:0x34d399, transparent:true, opacity:.55});
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(.010,.010,4.1,8),laserMaterial);
    laser.position.set(1.98,1.12,.20);
    laser.rotation.z=-.35;
    add(laser);
    animatedParts.push(t=>{laserMaterial.opacity=.24+.39*Math.abs(Math.sin(t*3.5));});
  } else if(relicId === 'pioneer-10') {
    // Pioneer 10 with decagonal bus, two RTG booms, long magnetometer boom and antenna feed support.
    const highGain = dish(1.44,[0,.60,0]);
    const bus = add(new THREE.Group());
    bus.position.set(0,-.18,0);
    cylinder(.50,.42,gold,[0,0,0],10,bus);
    cylinder(.56,.06,white,[0,.22,0],10,bus);
    cylinder(.56,.06,white,[0,-.22,0],10,bus);
    for(let i=0;i<10;i++){
      const a = i/10*Math.PI*2;
      box(.12,.14,.04,foil,[Math.cos(a)*.52,0,Math.sin(a)*.52],bus).rotation.y = -a;
    }
    if (xrayMode) box(.44,.25,.44,coreMat,[0,0,0],bus);

    // Struts from bus to the dish back structure.
    for(let a=0;a<3;a++){
      const ang = a*Math.PI*2/3 + Math.PI/6;
      rod([Math.cos(ang)*.18,.04,Math.sin(ang)*.18],[Math.cos(ang)*.62,.42,Math.sin(ang)*.62],.018,gray);
      rod([Math.cos(ang)*.18,.04,Math.sin(ang)*.18],[Math.cos(ang)*.22,.93,Math.sin(ang)*.22],.015,white);
    }
    const feed = cylinder(.09,.18,gray,[0,1.36,0],16);
    const horn = new THREE.Mesh(new THREE.ConeGeometry(.09,.16,14), white);
    horn.position.set(0,1.48,0); horn.rotation.x = Math.PI; add(horn);

    // Two opposed RTG booms.
    [-1,1].forEach(side=>{
      rod([side*.30,-.16,0],[side*1.56,-.34,0],.028,white);
      rod([side*.32,-.04,0],[side*1.56,-.34,0],.016,gray);
      rod([side*.16,-.01,side*.10],[side*1.20,-.30,side*.07],.012,gray);
      ribbedRTG([side*1.86,-.38,0],Math.PI/2);
    });

    // Long magnetometer boom and science booms.
    rod([0,-.16,-.18],[0,-.26,-2.98],.015,white);
    rod([0,-.18,-.62],[0,-.30,-3.25],.009,gray);
    ball(.07,black,[0,-.31,-3.22]);
    rod([.16,.02,.30],[1.02,.20,.72],.012,gray);
    rod([-.16,.02,.28],[-.92,.12,.84],.012,gray);
    rod([0,-.08,.34],[0,.12,1.02],.012,white);
    box(.28,.18,.08,foil,[.18,-.02,.58]);
    box(.12,.12,.12,gray,[-.25,.04,-.48]);
  } else {
    // Voyager 1 with dish, decagonal bus, scan platform, RTG boom, magnetometer and plasma antennas.
    const voyagerDish = dish(1.58,[0,.60,0]);
    const bus = add(new THREE.Group());
    bus.position.set(0,-.16,0);
    cylinder(.56,.48,gold,[0,0,0],10,bus);
    cylinder(.60,.07,white,[0,.25,0],10,bus);
    cylinder(.52,.12,black,[0,-.28,0],10,bus);
    if (xrayMode) box(.42,.24,.42,coreMat,[0,0,0],bus);
    for(let a=0;a<4;a++){
      const ang = a*Math.PI/2 + Math.PI/4;
      rod([Math.cos(ang)*.18,.06,Math.sin(ang)*.18],[Math.cos(ang)*.48,.46,Math.sin(ang)*.48],.018,gray);
    }

    // Feed / tripod behind the antenna.
    rod([0,.14,0],[0,1.33,0],.018,white);
    const feedCone = new THREE.Mesh(new THREE.ConeGeometry(.08,.16,14), gray);
    feedCone.position.set(0,1.45,0); feedCone.rotation.x = Math.PI; add(feedCone);

    // Golden record mounted on the bus exterior.
    const record = cylinder(.23,.03,copper,[.48,-.02,.40],28);
    record.rotation.x = Math.PI/2;
    cylinder(.075,.03,black,[.48,-.02,.43],16).rotation.x = Math.PI/2;

    // Long boom carrying three RTGs.
    rod([-.34,-.18,0],[-1.98,-.46,0],.034,white);
    for(let i=0;i<3;i++){
      const rtg = ribbedRTG([-1.90 - i*.36,-.48,0],Math.PI/2);
      rtg.rotation.y = .08;
    }

    // Articulated scan platform with cameras/instruments.
    rod([.38,-.08,.12],[1.32,.02,.25],.03,gray);
    const platform = add(new THREE.Group());
    platform.position.set(1.45,.02,.26);
    box(.56,.20,.42,white,[0,0,0],platform);
    box(.34,.12,.28,gray,[0,.16,.02],platform);
    const camera1 = cylinder(.08,.18,lensMat,[.32,.02,.10],16,platform); camera1.rotation.z = Math.PI/2;
    const camera2 = cylinder(.06,.12,lensMat,[.34,-.03,-.10],16,platform); camera2.rotation.z = Math.PI/2;
    box(.18,.12,.18,black,[-.10,.15,.13],platform);
    rod([.00,-.10,-.18],[.42,-.22,-.45],.015,gray,platform);
    box(.16,.08,.12,gray,[.48,-.24,-.50],platform);

    // Long magnetometer boom and crossed plasma-wave antennas.
    rod([.06,-.34,0],[.34,-.56,2.38],.010,white);
    rod([1.35,.09,0],[2.92,.88,0],.008,gray);
    rod([1.35,.09,0],[2.92,-.88,0],.008,gray);
    rod([0,.02,-.32],[0,.24,-1.10],.012,gray);
    box(.15,.11,.09,gray,[.20,.18,-.30]);
  }

  return {craft, animatedParts};
}
