import { Button, Card, Input, Row } from "antd";
import React, { useRef, useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import {font, video,table,list,image,formatBlock,fontSize,fontColor,hiliteColor,align,lineHeight,horizontalRule,template,link} from 'suneditor/src/plugins'

import { API } from "@/utils/api";
import "suneditor/dist/css/suneditor.min.css";

const MySunEditor = ({
  onChange = (content:any) => {},
  initialTemplateName = "",
  initialContent = "",
  initialTempVar = [],
}) => {
  const [templateName, setTemplateName] = useState(initialTemplateName);
  const [tempVar, setTempVar] = useState(initialTempVar);
  const editor = useRef();

  const uploadHandlerServer = async (file:any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post(`/api/v1/fileupload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = res.data.data.id;
      const url = `https://drive.google.com/thumbnail?id=${id}`;
      return url;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getSunEditorInstance = (sunEditor:any) => {
    editor.current = sunEditor;
  };

  const handleImageUploadBefore = (files:any, info:any, uploadHandler:any) => {
    const uploadImage = async () => {
      const url = await uploadHandlerServer(files[0]);
      if (url) {
        uploadHandler({
          result: [
            {
              url: url,
              name: files[0].name,
              size: files[0].size,
            },
          ],
        });
      } else {
        uploadHandler();
      }
    };
    uploadImage();
    return undefined;
  };

  return (
    <Card className="m-1">
      <Row>
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          onImageUploadBefore={handleImageUploadBefore}
          onImageUploadError={(errorMessage, result) => {
            console.error(errorMessage, result);
          }}
          defaultValue={initialContent}
          onChange={onChange}
          setOptions={{
            plugins: [video,table,font,list,image,formatBlock,fontSize,fontColor,hiliteColor,align,lineHeight,template,horizontalRule,link],
            buttonList: [
              ["font", "fontSize", "formatBlock",],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
                
              ],
              ["align", "horizontalRule", "list", "table"],
              ["fontColor", "hiliteColor"],
              ["outdent", "indent"],
              ["undo", "redo"],
              ["image", "video", "link"],
              ["preview", "print"],
              ["showBlocks", "codeView", "fullScreen"],
            ],
            videoFileInput: false,
          }}
          height="60vh"
        />
      </Row>
    </Card>
  );
};

export default MySunEditor;
