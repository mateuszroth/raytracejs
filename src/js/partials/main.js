$(function() {
    var $cameraPointX = $("#cameraPointX");
    $cameraPointX.val(localStorage['cameraPointX'] || cameraPointXDefault);

    var $cameraPointY = $("#cameraPointY");
    $cameraPointY.val(localStorage['cameraPointY'] || cameraPointYDefault);

    var $cameraPointZ = $("#cameraPointZ");
    $cameraPointZ.val(localStorage['cameraPointZ'] || cameraPointZDefault);

    var $cameraAngle = $("#cameraAngle");
    $cameraAngle.val(localStorage['cameraAngle'] || cameraAngleDefault);

    var $cameraVectorX = $("#cameraVectorX");
    $cameraVectorX.val(localStorage['cameraVectorX'] || cameraVectorXDefault);

    var $cameraVectorY = $("#cameraVectorY");
    $cameraVectorY.val(localStorage['cameraVectorY'] || cameraVectorYDefault);

    var $cameraVectorZ = $("#cameraVectorZ");
    $cameraVectorZ.val(localStorage['cameraVectorZ'] || cameraVectorZDefault);

    var $cameraSave = $("#cameraSave");

    var $pointLight1X = $("#pointLight1X");
    $pointLight1X.val(localStorage['pointLightX'] || lightsDefault[0].x);

    var $pointLight1Y = $("#pointLight1Y");
    $pointLight1Y.val(localStorage['pointLightY'] || lightsDefault[0].y);

    var $pointLight1Z = $("#pointLight1Z");
    $pointLight1Z.val(localStorage['pointLightZ'] || lightsDefault[0].z);

    var $lightsSave = $("#lightsSave");

    $pointLight1X.prop('disabled', true);
    $pointLight1Y.prop('disabled', true);
    $pointLight1Z.prop('disabled', true);

    var $dynamic = $("#dynamic");

    if (localStorage['dynamic'] == 'false') {
        $dynamic.prop('checked', false);
        $pointLight1X.prop('disabled', false);
        $pointLight1Y.prop('disabled', false);
        $pointLight1Z.prop('disabled', false);
    }


    $cameraSave.click(function() {
        localStorage['cameraPointX'] = $cameraPointX.val() || cameraPointXDefault;
        localStorage['cameraPointY'] = $cameraPointY.val() || cameraPointYDefault;
        localStorage['cameraPointZ'] = $cameraPointZ.val() || cameraPointZDefault;
        localStorage['cameraAngle'] = $cameraAngle.val() || cameraAngleDefault;
        localStorage['cameraVectorX'] = $cameraVectorX.val() || cameraVectorXDefault;
        localStorage['cameraVectorY'] = $cameraVectorY.val() || cameraVectorYDefault;
        localStorage['cameraVectorZ'] = $cameraVectorZ.val() || cameraVectorZDefault;

        location.reload();
    });

    $lightsSave.click(function() {
        localStorage['pointLightX'] = $pointLight1X.val() || lightsDefault[0].x;
        localStorage['pointLightY'] = $pointLight1Y.val() || lightsDefault[0].y;
        localStorage['pointLightZ'] = $pointLight1Z.val() || lightsDefault[0].z;

        location.reload();
    });

    $dynamic.click(function() {
        if ($dynamic.is(":checked")) {
            $pointLight1X.prop('disabled', true);
            $pointLight1Y.prop('disabled', true);
            $pointLight1Z.prop('disabled', true);
            localStorage['dynamic'] = true;
        } else {
            $pointLight1X.prop('disabled', false);
            $pointLight1Y.prop('disabled', false);
            $pointLight1Z.prop('disabled', false);
            localStorage['dynamic'] = false;
        }
        location.reload();
    });
});
