import { useState, useEffect, createContext } from "react";
import ClienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormTarea, setModalFormTarea] = useState(false);
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [colaborador, setColaborador] = useState({});
  const [buscador, setBuscador] = useState(false);

  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const obtnerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await ClienteAxios.get("/proyectos", config);
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtnerProyectos();
  }, [auth]);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await nuevoProyecto(proyecto);
    }
  };

  const editarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await ClienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      );

      // Sincronizar el State
      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );
      setProyectos(proyectosActualizados);
      // Mostrar la alerta
      setAlerta({
        msg: "Proyecto actualizado correctamente",
        error: false,
      });

      // Redireccionar
      setTimeout(() => {
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const nuevoProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await ClienteAxios.post("/proyectos", proyecto, config);
      setProyectos([...proyectos, data]);
      setAlerta({
        msg: "Proyecto creado correctamente",
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await ClienteAxios(`/proyectos/${id}`, config);
      setProyecto(data);
      setAlerta({});
    } catch (error) {
      navigate("/proyectos");
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    }
    setCargando(false);
  };

  const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // Sinconizar el State
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      setProyectos(proyectosActualizados);
      const { data } = await ClienteAxios.delete(`/proyectos/${id}`, config);
      setAlerta({
        msg: data.msg,
        error: false,
      });
      // Redireccionar
      setTimeout(() => {
        navigate("/proyectos");
        setAlerta({});
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalTarea = () => {
    setModalFormTarea(!modalFormTarea);
    setTarea({});
  };

  const submitTarea = async (tarea) => {
    if (tarea.id) {
      await editarTarea(tarea);
    } else {
      await nuevaTarea(tarea);
    }
  };

  const nuevaTarea = async (tarea) => {
    // Llamar api con las tareas
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await ClienteAxios.post("/tareas", tarea, config);
      // Cerrar el modal
      setAlerta({});
      setModalFormTarea(false);

      // Socket io
      socket.emit("nueva tarea", data);
    } catch (error) {
      console.log(error);
    }
  };

  const editarTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await ClienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      );

      setAlerta({});
      setModalFormTarea(false);
      // Socket io
      socket.emit("actualizar tarea", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarTarea = async (tarea) => {
    setTarea(tarea);
    setModalFormTarea(true);
  };

  const handleModalEliminarTarea = async (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await ClienteAxios.delete(
        `/tareas/${tarea._id}`,
        config
      );
      setAlerta({
        msg: data.msg,
        error: false,
      });

      // Actualizar el DOM
      setModalEliminarTarea(false);

      // Socket io
      socket.emit("eliminar tarea", tarea);
      setTarea({});
      setTimeout(() => {
        setAlerta({});
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const submitColaborador = async (email) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await ClienteAxios.post(
        "/proyectos/colaboradores",
        { email },
        config
      );
      setColaborador(data);
      setAlerta({});
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setCargando(false);
    }
  };

  const agregarColaborador = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await ClienteAxios.post(
        `/proyectos/colaboradores/${proyecto._id}`,
        email,
        config
      );
      setAlerta({
        msg: data.msg,
        error: false,
      });
      setColaborador({});
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const modalHandleEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  };

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await ClienteAxios.post(
        `/proyectos/eliminar-colaborador/${proyecto._id}`,
        { id: colaborador._id },
        config
      );
      const proyectoActualizado = { ...proyecto };
      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradorState) => colaboradorState._id !== colaborador._id
        );

      setProyecto(proyectoActualizado);
      setAlerta({
        msg: data.msg,
        error: false,
      });
      setColaborador({});
      setModalEliminarColaborador(false);
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      console.log(error.response);
    }
  };

  const completarTarea = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await ClienteAxios.post(
        `/tareas/estado/${id}`,
        {},
        config
      );

      // Socket io
      socket.emit("completar tarea", data);

      setTarea({});
      setAlerta({});
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleBuscador = () => {
    setBuscador(!buscador);
  };

  // Socket Io
  const submitTareasProyecto = (tarea) => {
    const proyectosActualizado = { ...proyecto };
    proyectosActualizado.tareas = [...proyectosActualizado.tareas, tarea];
    setProyecto(proyectosActualizado);
  };

  const submitEliminarTarea = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      (tareaState) => tareaState._id !== tarea._id
    );
    setProyecto(proyectoActualizado);
  };

  const submitEditarTarea = (tarea) => {
    // Actualizar el DOM
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyecto(proyectoActualizado);
  };

  const submitCompltado = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyecto(proyectoActualizado);
  };

  const cerrarSesionProyectos = () => {
    setProyecto({});
    setProyectos([]);
    setAlerta({});
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        submitProyecto,
        alerta,
        setAlerta,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        handleModalTarea,
        modalFormTarea,
        submitTarea,
        handleEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        modalEliminarColaborador,
        modalHandleEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        submitEliminarTarea,
        submitEditarTarea,
        submitCompltado,
        cerrarSesionProyectos,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };
export default ProyectosContext;
