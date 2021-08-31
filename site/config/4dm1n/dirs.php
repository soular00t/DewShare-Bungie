<?php require_once "../src/scripts/php/functions.php"; error_reporting(E_ERROR | E_WARNING | E_PARSE);
print $_HEAD."<table class='uploader' height='400'><tr><td><center><b>FILESHARE CLEANUP</b><br />";

//CHECK FOR ADMIN PASSWORD OR USER SESSION
if (isset($_AUTH)) {
    $t='<i>All files within this directory correspond to the database entries. Nothing to delete</i>';
    if (isset($_GET['screenshots'])) {
        $Path='.../../FILESHARE/enc/screenshots/*'; 
        $files = glob($Path);
        foreach($files as $file) {
            $thefile = base64_encode(str_replace('../../','',$file));
            $sql = $_SQL->query("SELECT url FROM media WHERE type='s' AND url='{$thefile}' LIMIT 1") or die($_SQL->error);
            if($sql->num_rows < 1) {
            if (isset($_USER) && $_USER['group'] > 2) $t="\n\n\t\t<input type='button' onclick=\"location='?screenshots&themastervault';\" value='Clean Directory' />";
                if (isset($_GET['themastervault'])) {
                    unlink($file); 
                    echo "<span style='color:red;'>DELETED: <b>{$file}</b>, since path not in database</span>\n";
                } else echo "<span style='color:orange;'>NOT FOUND: <b>{$file}</b>, should be deleted</span>\n";
            }
            else echo "<span style='color:green;'>LOCATED: <b>{$file}</b>, should not be deleted.</span>\n";
        } echo "</pre>".$t."</center>";
    } 

    elseif (isset($_GET['maps'])) {
        $Path='../../../FILESHARE/enc/maps/*'; 
        $files = glob($Path);
        foreach($files as $file) {
            $thefile = base64_encode(str_replace('../../','',$file));
            $sql = $_SQL->query("SELECT directURL FROM maps WHERE directURL='{$thefile}' LIMIT 1") or die($_SQL->error);
            if($sql->num_rows < 1) {
            if (isset($_USER) && $_USER['group'] > 2) $t="\n\n\t\t<input type='button' onclick=\"location='?maps&themastervault';\" value='Clean Directory' />";
                if (isset($_GET['themastervault'])) {
                    unlink($file); 
                    echo "<span style='color:red;'>DELETED: <b>{$file}</b>, since path not in database</span>\n";
                } else echo "<span style='color:orange;'>NOT FOUND: <b>{$file}</b>, should be deleted</span>\n";
            }
            else echo "<span style='color:green;'>LOCATED: <b>{$file}</b>, should not be deleted.</span>\n";
        } echo "</pre>".$t."</center>";
    } 

    elseif (isset($_GET['variants'])) {
        $Path='../../../FILESHARE/enc/variants/*'; 
        $files = glob($Path);
        foreach($files as $file) {
            $thefile = base64_encode(str_replace('../../','',$file));
            $sql = $_SQL->query("SELECT directURL FROM files WHERE type='variant' AND directURL='{$thefile}' LIMIT 1") or die($_SQL->error);
            if($sql->num_rows < 1) {
            if (isset($_USER) && $_USER['group'] > 2) $t="\n\n\t\t<input type='button' onclick=\"location='?variants&themastervault';\" value='Clean Directory' />";
                if (isset($_GET['themastervault'])) {
                    unlink($file); 
                    echo "<span style='color:red;'>DELETED: <b>{$file}</b>, since path not in database</span>\n";
                } else echo "<span style='color:orange;'>NOT FOUND: <b>{$file}</b>, should be deleted</span>\n";
            }
            else echo "<span style='color:green;'>LOCATED: <b>{$file}</b>, should not be deleted.</span>\n";
        } echo "</pre>".$t."</center>";
    } 
    else {
        echo "<p><a href='?screenshots'>Clean Screenshots</a> - <a href='?variants'>Clean Gametypes</a> - <a href='?maps'>Clean Forged Maps</a></p>";
    }


} 
//REJECT IF NOT ADMIN
else die("<script>location=history.back;</script>Access Denied");

print "</td></tr></table>".$_FOOT; ?>