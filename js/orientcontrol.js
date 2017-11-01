  function OrientControl() {

    var scope = this;

    // Input
    this.ix = 0;
    this.iy = 0;

    // Callbacks
    function onDeviceOrientation(event) {

        // Validate environment and event properties.
        if (event.beta != null && event.gamma != null) {
					//手机躺下是 0 0 0
					//贝塔是前后 竖起来是 90， 拿手机的头戳自己是 +-180度  躺着再往前转就是 - 的度数了
					//阿尔法是手机左扭腰，右扭腰， 朝右边扭是 + 左边 是 -
					//伽马是手机左右歪脑袋 右边歪是+ 左边歪是-
					//暂时不要阿尔法！因为手机扭腰，屏幕你都看不到了的说。。
          // Extract Rotation
          var x = (event.gamma || 0) ; // -90 :: 90
          var y = (event.beta  || 0) ; //  -90 :: 90
					
          // Set Input
          var ix = THREE.Math.mapLinear(x, -30, 30, -11, 11);
          var iy = THREE.Math.mapLinear(y, 0, 50, 11, -11);
          
          if(ix > 11) ix = 11;
          if(ix < -11) ix = -11;
          if(iy > 11) iy = 11;
          if(iy < -11) iy = -11;
					
					scope.ix = ix;
					scope.iy = iy;
					
        }
    }

    window.addEventListener('deviceorientation', onDeviceOrientation);

  }

